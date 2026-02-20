import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";

const getAutoDescription = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("baño") || lower.includes("banos")) return "Baños disponibles para estudiantes y personal.";
  if (lower.includes("santo domingo")) return "Máquina Expendedora de Café Santo Domingo.";
  if (lower.includes("laboratorio") || lower.includes("lab")) return "Laboratorio equipado para prácticas y uso académico.";
  if (lower.includes("aula")) return "Aula destinada a clases y actividades académicas.";
  if (lower.includes("recepcion")) return "Área de recepción para asistencia e información.";
  if (lower.includes("vending")) return "Máquina expendedora con snacks y bebidas.";
  if (lower.includes("cafeteria") || lower.includes("café")) return "Área de cafetería para alimentos y bebidas.";
  if (lower.includes("registro") || lower.includes("admisiones")) return "Área administrativa para procesos académicos.";
  if (lower.includes("computo")) return "Sala equipada con computadoras y recursos tecnológicos.";
  if (lower.includes("biblioteca")) return "Área de biblioteca y recursos de estudio.";
  if (lower.includes("salon")) return "Salón destinado a reuniones y actividades académicas.";
  if (lower.includes("economato") || lower.includes("papeleria")) return "Establecimiento comercial para suplir materiales universitarios.";
  if (lower.includes("pet")) return "Área de servicios y atención para mascotas.";
  if (lower.includes("campo")) return "Área deportiva destinada a actividades físicas.";
  return "Espacio académico o administrativo dentro del campus.";
};

function RoomCardImpl({
  styles,
  icons,

  name,
  capacity,
  description,
  ac = undefined,
  projector = undefined,
}) {
  const lower = name.toLowerCase();
  const finalDescription = description ?? getAutoDescription(name);
  const isClassroom = lower.includes("aula");
  const isLab = lower.includes("laboratorio") || lower.includes("lab");

  const {
    ICON_CHAIR,
    ICON_BATHROOM,
    ICON_LAB,
    ICON_AUDITORIO,
    ICON_COFFEE,
    ICON_CREDIT,
    ICON_DOG,
    ICON_ENFERMERIA2,
    ICON_LIBRARY2,
    ICON_VENDING2,
    ICON_COSMETOLOGY,
    ICON_AMADITA,
    ICON_DESK,
    ICON_PAPELERIA,
    ICON_IT,
    ICON_MATH,
    ICON_TREE,
    ICON_BASEBALL,
    ICON_TOURISM,
    ICON_DERECHO,

    ICON_AC_FALSE,
    ICON_PROJECTOR_FALSE,
    ICON_AIR,
    ICON_PROJECTOR,
    ICON_STUDENTS,
  } = icons;

  let mainIcon = { src: ICON_CHAIR, size: 35 };
  if (lower.includes("baño") || lower.includes("banos")) mainIcon = { src: ICON_BATHROOM, size: 35 };
  else if (isLab) mainIcon = { src: ICON_LAB, size: 35 };
  else if (lower.includes("auditorio")) mainIcon = { src: ICON_AUDITORIO, size: 28 };
  else if (lower.includes("cafe") || lower.includes("coffee")) mainIcon = { src: ICON_COFFEE, size: 30 };
  else if (lower.includes("cobro") || lower.includes("pago") || lower.includes("cajero")) mainIcon = { src: ICON_CREDIT, size: 30 };
  else if (lower.includes("veterinaria") || lower.includes("pet")) mainIcon = { src: ICON_DOG, size: 26 };
  else if (lower.includes("medico") || lower.includes("dispensario")) mainIcon = { src: ICON_ENFERMERIA2, size: 30 };
  else if (lower.includes("biblioteca")) mainIcon = { src: ICON_LIBRARY2, size: 30 };
  else if (lower.includes("vending") || lower.includes("expendedoras")) mainIcon = { src: ICON_VENDING2, size: 36 };
  else if (lower.includes("estetica")) mainIcon = { src: ICON_COSMETOLOGY, size: 35 };
  else if (lower.includes("amadita")) mainIcon = { src: ICON_AMADITA, size: 35 };
  else if (lower.includes("direccion")) mainIcon = { src: ICON_DESK, size: 35 };
  else if (lower.includes("papeleria")) mainIcon = { src: ICON_PAPELERIA, size: 35 };
  else if (lower.includes("tecnico")) mainIcon = { src: ICON_IT, size: 35 };
  else if (lower.includes("math")) mainIcon = { src: ICON_MATH, size: 35 };
  else if (lower.includes("bosque")) mainIcon = { src: ICON_TREE, size: 35 };
  else if (lower.includes("campo")) mainIcon = { src: ICON_BASEBALL, size: 35 };
  else if (lower.includes("turismo")) mainIcon = { src: ICON_TOURISM, size: 35 };
  else if (lower.includes("derecho")) mainIcon = { src: ICON_DERECHO, size: 35 };

  return (
    <View style={styles.card}>
      <View style={styles.cardIconWrapper}>
        <Image
          source={mainIcon.src}
          style={{ width: mainIcon.size, height: mainIcon.size }}
          contentFit="contain"
          transition={0}
        />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardDescription}>{finalDescription}</Text>

        <View style={styles.cardFooter}>
          {(isClassroom || isLab || ac !== undefined) && (
            <View style={ac === false ? styles.badgeOff : styles.badge}>
              <Image
                source={ac === false ? ICON_AC_FALSE : ICON_AIR}
                style={styles.badgeIcon}
                contentFit="contain"
                transition={0}
              />
              {ac === false ? (
                <View style={styles.badgeOffOverlay}>
                  <Text style={styles.badgeOffX}>X</Text>
                </View>
              ) : (
                <Text style={styles.badgeText}>A/C</Text>
              )}
            </View>
          )}

          {(isClassroom || isLab || projector !== undefined) && (
            <View style={projector === false ? styles.badgeOff : styles.badge}>
              <Image
                source={projector === false ? ICON_PROJECTOR_FALSE : ICON_PROJECTOR}
                style={styles.badgeIcon}
                contentFit="contain"
                transition={0}
              />
              {projector === false && (
                <View style={styles.badgeOffOverlay}>
                  <Text style={styles.badgeOffX}>X</Text>
                </View>
              )}
            </View>
          )}

          {(isClassroom || isLab) && capacity && (
            <View style={styles.badge}>
              <Image
                source={ICON_STUDENTS}
                style={[styles.badgeIcon, { width: 16, height: 16 }]}
                contentFit="contain"
                transition={0}
              />
              <Text style={styles.badgeText}>{capacity}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default React.memo(
  RoomCardImpl,
  (a, b) =>
    a.name === b.name &&
    a.capacity === b.capacity &&
    a.description === b.description &&
    a.ac === b.ac &&
    a.projector === b.projector
);
