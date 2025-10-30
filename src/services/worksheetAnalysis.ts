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

export async function analyzeWorksheet(imageFile: File): Promise<Problem[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(
    `${supabaseUrl}/functions/v1/analyze-worksheet`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to analyze worksheet: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.problems;
}
