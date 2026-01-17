import confidence from "./confidence.service.js";

const parseResume = (text) => {
  const nameMatch = text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/\+?\d{10,13}/);

  return {
    name: { value: nameMatch?.[0] || null, confidence: confidence(nameMatch) },
    email: { value: emailMatch?.[0] || null, confidence: confidence(emailMatch) },
    phone: { value: phoneMatch?.[0] || null, confidence: confidence(phoneMatch) },
    skills: { value: ["JavaScript", "React"], confidence: 80 } // placeholder
  };
};

export default parseResume;
