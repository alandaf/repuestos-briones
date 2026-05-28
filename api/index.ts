import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Error initializing Gemini AI:", e);
  }
}

// API Route for Vehicle Data
app.get("/api/vehicle/:identifier", (req, res) => {
  const identifier = req.params.identifier.toUpperCase().replace(/[- ]/g, "");

  const vehicleRegistry: Record<string, { brand: string; model: string; year: number; engine: string }> = {
    "ABCD12": { brand: "Hyundai", model: "Accent", year: 2018, engine: "1.4L DOHC" },
    "XYZW99": { brand: "Toyota", model: "Hilux", year: 2022, engine: "2.8L Diésel" },
    "AB1234": { brand: "Nissan", model: "Sentra", year: 2019, engine: "1.8L DOHC" },
    "FP9921": { brand: "Hyundai", model: "Tucson", year: 2020, engine: "2.0L MPI" },
    "17CHARVINEXAMPLE1": { brand: "Ford", model: "F-150", year: 2021, engine: "3.5L EcoBoost V6" },
    "17CHARVINEXAMPLE2": { brand: "Toyota", model: "Corolla", year: 2023, engine: "1.8L Hybrid" }
  };

  if (vehicleRegistry[identifier]) {
    return res.json({
      plateOrVin: identifier,
      ...vehicleRegistry[identifier]
    });
  }

  if (identifier.length === 17) {
    return res.json({
      plateOrVin: identifier,
      brand: "Chevrolet",
      model: "Silverado",
      year: 2022,
      engine: "5.3L Ecotec V8"
    });
  } else if (identifier.length >= 4 && identifier.length <= 8) {
    return res.json({
      plateOrVin: identifier,
      brand: "Suzuki",
      model: "Swift",
      year: 2021,
      engine: "1.2L Dualjet"
    });
  }

  return res.status(404).json({ error: "Identificador inválido." });
});

// API Route for Chatbot Support
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensaje vacío" });
  }

  if (ai) {
    try {
      const systemInstruction = `
        Eres el Asistente Técnico Virtual de "Repuestos Briones", una prestigiosa distribuidora B2B chilena de autopartes.
        Tu rol es asesorar a mecánicos profesionales y clientes en la identificación de repuestos, resolución de fallas técnicas mecánicas y recomendación de repuestos OEM.
        Usa un tono profesional, servicial y experto.
        Mantén tus respuestas breves y directas al grano, estructuradas con viñetas cuando sea apropiado.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          ...(history || []).map((h: any) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.text }]
          })),
          { role: "user", parts: [{ text: message }] }
        ]
      });

      const reply = response.text || "No obtuve respuesta del motor de IA.";
      return res.json({ reply });
    } catch (error: any) {
      console.error("Gemini AI API Error:", error);
      return res.status(500).json({ error: "Fallo al generar respuesta de IA", details: error.message });
    }
  } else {
    // Simulated fallback
    let simulatedReply = "Simulación: Entendido. Para recomendarte la pieza exacta, por favor indícame la patente de tu auto o el número de chasis (VIN).";
    const lower = message.toLowerCase();
    if (lower.includes("aceite")) {
      simulatedReply = "Para motores modernos diésel, te sugiero un aceite sintético 5W-30 que cumpla con la norma ACEA C3. Disponemos de marcas como Castrol Edge y Mobil 1.";
    } else if (lower.includes("freno") || lower.includes("pastilla")) {
      simulatedReply = "Las pastillas de freno cerámicas de marca Ultra-Stop ofrecen excelente frenado y bajo polvo. Son compatibles con el Hyundai Accent y Kia Rio.";
    } else if (lower.includes("ruido") || lower.includes("silbido")) {
      simulatedReply = "Un silbido al presionar el embrague suele indicar un rodamiento de empuje desgastado. Te sugiero revisar el kit de embrague completo.";
    } else if (lower.includes("vin") || lower.includes("chasis")) {
      simulatedReply = "El número VIN de 17 dígitos se encuentra en el padrón del vehículo, en la placa del pilar de la puerta del conductor o grabado en la esquina del parabrisas.";
    }
    return res.json({ reply: `${simulatedReply} (Modo Demostración Activo - Clave API no configurada)` });
  }
});

export default app;
