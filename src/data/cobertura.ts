/**
 * 📍 COBERTURA — ciudades que se muestran en el mapa de «Nosotros».
 * Para agregar o quitar una ciudad basta con editar esta lista (latitud y
 * longitud en grados decimales; la sede se marca con `sede: true`).
 */
import { MAPA } from "./mapaColombia";

export interface Ciudad {
  nombre: string;
  lat: number;
  lon: number;
  sede?: boolean;
}

export const CIUDADES: Ciudad[] = [
  { nombre: "Bogotá", lat: 4.711, lon: -74.0721, sede: true },
  { nombre: "Medellín", lat: 6.2442, lon: -75.5812 },
  { nombre: "Cali", lat: 3.4516, lon: -76.532 },
  { nombre: "Barranquilla", lat: 10.9685, lon: -74.7813 },
  { nombre: "Bucaramanga", lat: 7.1193, lon: -73.1227 },
  { nombre: "Cartagena", lat: 10.391, lon: -75.4794 },
  { nombre: "Pereira", lat: 4.8133, lon: -75.6961 },
  { nombre: "Manizales", lat: 5.0703, lon: -75.5138 },
  { nombre: "Ibagué", lat: 4.4389, lon: -75.2322 },
  { nombre: "Villavicencio", lat: 4.142, lon: -73.6266 },
];

/** Posición de una coordenada sobre el lienzo del mapa, en % (0–100). */
export function posicion(lat: number, lon: number): { x: number; y: number } {
  const { k, minX, minY, escala, margen } = MAPA.proy;
  const x = (lon * k - minX) * escala + margen;
  const y = -lat * 1 - minY;
  return { x: (x / MAPA.ancho) * 100, y: ((y * escala + margen) / MAPA.alto) * 100 };
}
