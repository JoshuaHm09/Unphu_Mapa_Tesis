import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../utils/supabase";

let guestSessionActive = false;

export default function useAuthSession(adminEmail) {
  const [showLoginOverlay, setShowLoginOverlay] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const loadSession = async () => {
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
      setLoginError("");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let mensaje =
          "Para continuar, ingrese un correo electrónico válido y una contraseña.";

        if (error.message === "Invalid login credentials") {
          mensaje =
            "El correo electrónico o la contraseña ingresados son incorrectos.";
        }

        setLoginError(mensaje);
        return false;
      }

      const loggedEmail = data?.user?.email || "";

      guestSessionActive = false;
      setHasEnteredApp(true);
      setShowLoginOverlay(false);
      setIsAdmin(loggedEmail === adminEmail);
      setLoginError("");

      return true;
    },
    [adminEmail]
  );

  const handleContinueGuest = useCallback(() => {
    guestSessionActive = true;
    setIsAdmin(false);
    setHasEnteredApp(true);
    setShowLoginOverlay(false);
    setLoginError("");
  }, []);

  const handleLogout = useCallback(async () => {
    guestSessionActive = false;
    await supabase.auth.signOut();
    setIsAdmin(false);
    setHasEnteredApp(false);
    setShowLoginOverlay(true);
    setLoginError("");
  }, []);

  return {
    showLoginOverlay,
    isAdmin,
    hasEnteredApp,
    loginError,
    handleLogin,
    handleContinueGuest,
    handleLogout,
  };
}