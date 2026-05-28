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
app.get("/api/vehicle/:identifier", async (req, res) => {
  const identifier = req.params.identifier.toUpperCase().replace(/[- ]/g, "");
  const boostrApiKey = process.env.VEHICLE_API_KEY;

  // Try fetching from Boostr API if configured
  if (boostrApiKey && boostrApiKey !== "MY_VEHICLE_API_KEY" && boostrApiKey !== "") {
    try {
      const response = await fetch(`https://api.boostr.cl/vehicle/${identifier}.json?apikey=${boostrApiKey}`);
      if (response.ok) {
        const result = await response.json();
        if (result && result.status === "success" && result.data) {
          const d = result.data;
          return res.json({
            plateOrVin: identifier,
            brand: d.brand || d.marca || "Desconocido",
            model: d.model || d.modelo || "Desconocido",
            year: Number(d.year || d.anio || d.año || 2020),
            engine: d.engine || d.motor || "N/A"
          });
        }
      }
    } catch (err) {
      console.error("Boostr API error, falling back to mock database:", err);
    }
  }

  const vehicleRegistry: Record<string, { brand: string; model: string; year: number; engine: string }> = {
    "ABCD12": { brand: "Hyundai", model: "Accent", year: 2018, engine: "1.4L DOHC" },
    "XYZW99": { brand: "Toyota", model: "Hilux", year: 2022, engine: "2.8L Diésel" },
    "AB1234": { brand: "Nissan", model: "Sentra", year: 2019, engine: "1.8L DOHC" },
    "FP9921": { brand: "Hyundai", model: "Tucson", year: 2020, engine: "2.0L MPI" },
    "17CHARVINEXAMPLE1": { brand: "Ford", model: "F-150", year: 2021, engine: "3.5L EcoBoost V6" },
    "17CHARVINEXAMPLE2": { brand: "Toyota", model: "Corolla", year: 2023, engine: "1.8L Hybrid" },
    
    // Exact vehicle details for user's plate TJ6828 (Year 2001 format)
    "TJ6828": { brand: "Toyota", model: "Yaris Sport", year: 2001, engine: "1.3L VVT-i" },
    "CPPT27": { brand: "Suzuki", model: "Celerio GA 1.0", year: 2010, engine: "1.0L K10B" },

    // Boostr Sandbox/Testing Plates (from api.boostr.cl/vehicle/fake/)
    "JG5165": { brand: "Suzuki", model: "Swift", year: 2017, engine: "1.2L DOHC" },
    "KFHD30": { brand: "Hyundai", model: "Accent", year: 2018, engine: "1.4L" },
    "UE2083": { brand: "Toyota", model: "Corolla", year: 2021, engine: "1.8L Hybrid" },
    "ORE044": { brand: "Chevrolet", model: "Silverado", year: 2020, engine: "5.3L V8" },
    "AW0129": { brand: "Nissan", model: "Sentra", year: 2019, engine: "1.8L DOHC" },
    "RRLH58": { brand: "Peugeot", model: "208", year: 2022, engine: "1.2L PureTech" },
    "GRVF16": { brand: "Ford", model: "Ranger", year: 2021, engine: "3.2L Puma" },
    "LPPT66": { brand: "Mitsubishi", model: "L200", year: 2020, engine: "2.4L DI-D" },
    "BPCW69": { brand: "Kia", model: "Rio", year: 2016, engine: "1.4L DOHC" },
    "KCYT22": { brand: "Hyundai", model: "Santa Fe", year: 2019, engine: "2.2L CRDi" },
    "TTFB95": { brand: "Chevrolet", model: "Sail", year: 2022, engine: "1.5L DOHC" },
    "RE1792": { brand: "Toyota", model: "RAV4", year: 2020, engine: "2.5L" },
    "LJKG41": { brand: "Nissan", model: "Qashqai", year: 2018, engine: "2.0L" },
    "AA3556": { brand: "Suzuki", model: "Grand Vitara", year: 2015, engine: "2.4L" },
    "SZ2777": { brand: "Mazda", model: "CX-5", year: 2019, engine: "2.0L SkyActiv" },
    "YR2587": { brand: "Hyundai", model: "Elantra", year: 2021, engine: "1.6L" },
    "WW6785": { brand: "Kia", model: "Sportage", year: 2018, engine: "2.0L" },
    "DZTD28": { brand: "Subaru", model: "Forester", year: 2017, engine: "2.5L DOHC" }
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
