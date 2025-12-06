import React from "react";
import {
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";

// =======================
// IMPORTAMOS ICONOS USADOS EN TU MAPA
// =======================

import BUILDING_ICON_WHITE from "../../assets/building_icon_white.png";
import FAVORITE_FILLED_GREEN from "../../assets/favorite_pressed_green.png";

import ICON_BATHROOM from "../../assets/bathrooom.png";
import ICON_LAB from "../../assets/lab.png";
import ICON_VENDING from "../../assets/Vending_Machine.png";
import ICON_TREE from "../../assets/Tree.png";
import ICON_CHAIR from "../../assets/chair.png";

import ICON_AUDITORIO from "../../assets/Auditorio.png";
import ICON_IT from "../../assets/computo.png";
import ICON_LIBRARY from "../../assets/Library.png";
import ICON_AMADITA from "../../assets/Amadita.png";
import ICON_ENFERMERIA from "../../assets/Enfermeria.png";

import ICON_SOCCER from "../../assets/Soccer.png";
import ICON_BASEBALL from "../../assets/Pelota.png";
import ICON_TENNIS from "../../assets/Tennis.png";
import ICON_BASKET from "../../assets/Basket.png";

import ICON_DOG from "../../assets/Dog_Paw.png";
import EDIFICIOS_CIRCULOS from "../../assets/Edi-09.png";

// ❗ NUEVOS ICONOS
import ICON_AIR from "../../assets/air-conditioner.png";
import ICON_PROJECTOR from "../../assets/projector.png";
import ICON_AC_FALSE from "../../assets/AC_False.png";
import ICON_PROJECTOR_FALSE from "../../assets/Projector_False.png";
import ICON_STUDENTS from "../../assets/students.png";

import CLOSE_ICON from "../../assets/close.png";


const LegendModal = ({ visible, onClose, bottomInset = 0 }) => {

  // =============== ITEMS DE LEYENDA ===============
  const legendItems = [
    {
      icon: EDIFICIOS_CIRCULOS,
      title: "Edificios",
      description: "Cada círculo con número representa un edificio del campus.",
      size: 33,
    },
    {
      icon: FAVORITE_FILLED_GREEN,
      title: "Favoritos",
      description: "Edificios guardados para acceso rápido.",
    },
    {
      icon: ICON_BATHROOM,
      title: "Baños",
      description: "Servicios sanitarios disponibles.",
    },
    {
      icon: ICON_LAB,
      title: "Laboratorios",
      description: "Espacios equipados para prácticas.",
    },
    {
      icon: ICON_VENDING,
      title: "Máquinas Expendedoras",
      description: "Snacks, café y bebidas.",
    },
    {
      icon: ICON_TREE,
      title: "Áreas Verdes",
      description: "Zonas de descanso y naturaleza.",
    },
    {
      icon: ICON_CHAIR,
      title: "Áreas de Estudio",
      description: "Aulas para clases y actividades.",
    },
    {
      icon: ICON_AUDITORIO,
      title: "Auditorio",
      description: "Salón para conferencias y eventos.",
    },
    {
      icon: ICON_IT,
      title: "Sala de Cómputo",
      description: "Equipos para trabajos y prácticas.",
    },
    {
      icon: ICON_LIBRARY,
      title: "Biblioteca",
      description: "Recursos de lectura y zonas de estudio.",
    },
    {
      icon: ICON_AMADITA,
      title: "Laboratorio Clínico",
      description: "Servicios de análisis clínicos.",
    },
    {
      icon: ICON_ENFERMERIA,
      title: "Enfermería",
      description: "Atención médica y primeros auxilios.",
    },
    {
      icon: ICON_SOCCER,
      title: "Campo de Fútbol",
      description: "Área destinada a la práctica y entrenamiento de fútbol.",
    },
    {
      icon: ICON_BASEBALL,
      title: "Campo de Béisbol",
      description: "Área destinada a la práctica y entrenamiento de béisbol.",
    },
    {
      icon: ICON_TENNIS,
      title: "Cancha de Tenis",
      description: "Área para la práctica recreativa y competitiva de tenis.",
    },
    {
      icon: ICON_BASKET,
      title: "Cancha de Basket",
      description: "Área destinada a la práctica y entrenamiento de baloncesto.",
    },
    {
      icon: ICON_DOG,
      title: "Pet Area",
      description: "Espacio para la atención y cuidado de mascotas.",
    },

   {
     icon: ICON_AIR,
     title: "Aire Acondicionado",
     description: "Aula equipada con aire acondicionado operativo.",
     badgeWhite: true,
   },
   {
     icon: ICON_AC_FALSE,
     title: "Aire Acondicionado (No disponible)",
     description: "Este espacio no cuenta con aire acondicionado.",
     badgeWhite: true,
   },
   {
     icon: ICON_PROJECTOR,
     title: "Proyector",
     description: "Espacio equipado con proyector funcional.",
     badgeWhite: true,
   },
   {
     icon: ICON_PROJECTOR_FALSE,
     title: "Proyector (No disponible)",
     description: "Este espacio no cuenta con proyector.",
     badgeWhite: true,
   },
   {
     icon: ICON_STUDENTS,
     title: "Capacidad de Estudiantes",
     description: "Indica la capacidad aproximada del aula.",
     badgeWhite: true,
   },

  ];


  // ======================= UI =======================
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >

      {/* OVERLAY */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: -15 + bottomInset,
          backgroundColor: "#00000070",
        }}
      />

      {/* CONTENIDO */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: "85%",
            backgroundColor: "white",
            borderRadius: 24,
            paddingTop: 55,
            paddingBottom: 22,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 12,
          }}
        >

          {/* BOTÓN CLOSE */}
          <Pressable
            onPress={onClose}
            hitSlop={20}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={CLOSE_ICON}
              style={{ width: 28, height: 28 }}
              contentFit="contain"
            />
          </Pressable>

          {/* TÍTULO */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "800",
              color: "#34A853",
              marginBottom: 18,
            }}
          >
            Leyenda
          </Text>

          {/* LISTA */}
          <ScrollView
            style={{
              maxHeight: 420,
              marginHorizontal: 15,
              borderRadius: 14,
              paddingVertical: 5,
            }}
          >

            {legendItems.map((item, index) => (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                  }}
                >
                  {/* ICON BADGE */}
                 <View
                   style={{
                     width: 42,
                     height: 42,
                     borderRadius: 25,
                     backgroundColor: item.badgeWhite ? "white" : "#079A30",
                     borderWidth: item.badgeWhite ? 1.4 : 0,
                     borderColor: item.badgeWhite ? "#079A30" : "transparent",
                     justifyContent: "center",
                     alignItems: "center",
                     marginRight: 13,
                     marginTop: item.offsetY ? item.offsetY : 0,
                   }}
                 >

                    <Image
                      source={item.icon}
                      style={{
                        width: item.size ? item.size : 26,
                        height: item.size ? item.size : 26,
                      }}
                      contentFit="contain"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#111",
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: "#555",
                        marginTop: 2,
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>

                {index < legendItems.length - 1 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#E5E5E5",
                      marginHorizontal: 10,
                    }}
                  />
                )}
              </View>
            ))}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LegendModal;
