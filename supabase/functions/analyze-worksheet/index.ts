import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Problem {
  id: number;
  text: string;
  hints: Hint[];
}

interface Hint {
  step: number;
  visual: {
    type: 'images';
    items: VisualItem[];
  };
  text: string;
}

interface VisualItem {
  src: string;
  state: 'normal' | 'eaten' | 'new';
  sparkle?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const imageBytes = await imageFile.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(imageBytes))
    );

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `この画像は小学1年生の算数プリントです。
画像から問題文を抽出してください。

出力は以下のJSON形式で返してください：
[
  {
    "text": "問題文をそのまま抽出",
    "type": "addition" または "subtraction",
    "numbers": [問題に出てくる数字の配列],
    "subject": "問題に出てくる物や人（例：いちご、こども、りんご）"
  }
]

注意：
- 問題文は子供向けのひらがなで書かれています
- 複数の問題がある場合は配列で返してください
- JSON以外の文字は含めないでください`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // JSONを抽出（```json ... ``` で囲まれている場合に対応）
    let jsonText = text.trim();
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    } else if (text.startsWith('```') && text.endsWith('```')) {
      jsonText = text.slice(3, -3).trim();
    }

    const extractedProblems = JSON.parse(jsonText);

    // 問題データを構造化
    const problems: Problem[] = extractedProblems.map((p: any, index: number) => {
      const hints = generateHints(p);
      return {
        id: index + 1,
        text: p.text,
        hints,
      };
    });

    return new Response(
      JSON.stringify({ problems }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to analyze image",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateHints(problem: any): Hint[] {
  const { type, numbers, subject } = problem;
  const hints: Hint[] = [];

  // 絵文字マッピング
  const emojiMap: { [key: string]: string } = {
    'いちご': 'strawberry',
    'こども': 'child',
    'りんご': 'apple',
    'みかん': 'orange',
    'バナナ': 'banana',
    'ボール': 'ball',
    'default': 'circle',
  };

  const icon = emojiMap[subject] || emojiMap['default'];

  if (type === 'subtraction') {
    // 引き算のヒント
    const initial = numbers[0];
    const subtract = numbers[1];

    // ステップ1: 最初の状態
    hints.push({
      step: 1,
      visual: {
        type: 'images',
        items: Array(initial).fill({ src: icon, state: 'normal' }),
      },
      text: `${subject}が${initial}${getCounter(subject)}`,
    });

    // ステップ2: 減らした状態
    hints.push({
      step: 2,
      visual: {
        type: 'images',
        items: [
          ...Array(initial - subtract).fill({ src: icon, state: 'normal' }),
          ...Array(subtract).fill({ src: icon, state: 'eaten' }),
        ],
      },
      text: `${subtract}${getCounter(subject)}へりました`,
    });

    // ステップ3: 答えを考える
    hints.push({
      step: 3,
      visual: {
        type: 'images',
        items: [
          ...Array(initial - subtract).fill({ src: icon, state: 'normal' }),
          ...Array(subtract).fill({ src: icon, state: 'eaten' }),
        ],
      },
      text: 'のこりはいくつかな？',
    });
  } else if (type === 'addition') {
    // 足し算のヒント
    const initial = numbers[0];
    const add = numbers[1];

    // ステップ1: 最初の状態
    hints.push({
      step: 1,
      visual: {
        type: 'images',
        items: Array(initial).fill({ src: icon, state: 'normal' }),
      },
      text: `${subject}が${initial}${getCounter(subject)}`,
    });

    // ステップ2: 増えた状態
    hints.push({
      step: 2,
      visual: {
        type: 'images',
        items: [
          ...Array(initial).fill({ src: icon, state: 'normal' }),
          ...Array(add).fill({ src: icon, state: 'new', sparkle: true }),
        ],
      },
      text: `${add}${getCounter(subject)}ふえました`,
    });

    // ステップ3: 答えを考える
    hints.push({
      step: 3,
      visual: {
        type: 'images',
        items: Array(initial + add).fill({ src: icon, state: 'normal' }),
      },
      text: 'ぜんぶでいくつかな？',
    });
  }

  return hints;
}

function getCounter(subject: string): string {
  // 助数詞を返す
  const counters: { [key: string]: string } = {
    'こども': 'にん',
    'いちご': 'こ',
    'りんご': 'こ',
    'みかん': 'こ',
    'バナナ': 'ほん',
    'ボール': 'こ',
  };
  return counters[subject] || 'こ';
}
