import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../utils/supabase";
{/* Esto vive solo mientras la app está corriendo.*/}
{/* Si reinicias la app, vuelve a false.*/}
let guestSessionActive = false;

export default function useAuthSession(adminEmail) {
  const [showLoginOverlay, setShowLoginOverlay] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
{/* Si el usuario siguió como invitado dentro de esta misma ejecución*/}
{/* de la app, no mostramos login otra vez aunque MapScreen se remonte.*/}
      if (guestSessionActive) {
        setIsAdmin(false);
        setHasEnteredApp(true);
        setShowLoginOverlay(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.log("SESSION ERROR:", error.message);
        setIsAdmin(false);
        setHasEnteredApp(false);
        setShowLoginOverlay(true);
        return;
      }

      const session = data?.session;
      const email = session?.user?.email || "";

      if (session) {
        guestSessionActive = false;
        setIsAdmin(email === adminEmail);
        setHasEnteredApp(true);
        setShowLoginOverlay(false);
      } else {
        setIsAdmin(false);
        setHasEnteredApp(false);
        setShowLoginOverlay(true);
      }
    };

    loadSession();
  }, [adminEmail]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email || "";

      if (session) {
        guestSessionActive = false;
        setIsAdmin(email === adminEmail);
        setHasEnteredApp(true);
        setShowLoginOverlay(false);
      } else {
        if (guestSessionActive) {
          setIsAdmin(false);
          setHasEnteredApp(true);
          setShowLoginOverlay(false);
        } else {
          setIsAdmin(false);
          setHasEnteredApp(false);
          setShowLoginOverlay(true);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [adminEmail]);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("LOGIN ERROR:", error);
        alert(error.message || "No se pudo iniciar sesión");
        return false;
      }

      const loggedEmail = data?.user?.email || "";

      guestSessionActive = false;
      setHasEnteredApp(true);
      setShowLoginOverlay(false);
      setIsAdmin(loggedEmail === adminEmail);

      return true;
    },
    [adminEmail]
  );

  const handleContinueGuest = useCallback(() => {
    guestSessionActive = true;
    setIsAdmin(false);
    setHasEnteredApp(true);
    setShowLoginOverlay(false);
  }, []);

  const handleLogout = useCallback(async () => {
    guestSessionActive = false;
    await supabase.auth.signOut();
    setIsAdmin(false);
    setHasEnteredApp(false);
    setShowLoginOverlay(true);
  }, []);

  return {
    showLoginOverlay,
    isAdmin,
    hasEnteredApp,
    handleLogin,
    handleContinueGuest,
    handleLogout,
  };
}