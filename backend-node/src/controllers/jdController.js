import axios from "axios";

export const generateJobDescription = async (req, res) => {
  try {
    const {
      jobTitle,
      industry,
      experienceLevel,
      keySkills,
      companyCulture,
      specialRequirements,
    } = req.body;

    if (!jobTitle || !industry || !experienceLevel || !keySkills?.length) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const prompt = `
Generate a professional, structured job description.

Job Title: ${jobTitle}
Industry: ${industry}
Experience Level: ${experienceLevel}
Key Skills: ${keySkills.join(", ")}
Company Culture: ${companyCulture}
Special Requirements: ${specialRequirements || "None"}

Use this structure:
- Job Title at Company
- About the Role (2-3 paragraphs)
- Key Responsibilities (5-7 bullets)
- Required Skills
- Preferred Skills
- Experience
- What We Offer (3-5 bullets)
- About Company
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:4001", // REQUIRED by OpenRouter
          "X-Title": "JD Generator Hackathon",
        },
      }
    );

    const jobDescription =
      response.data.choices?.[0]?.message?.content ||
      "Failed to generate job description.";

    res.status(200).json({ jobDescription });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: "Error generating job description",
      error: err.response?.data || err.message,
    });
  }
};
