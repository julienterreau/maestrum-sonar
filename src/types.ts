export type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  MODELSCOPE_API_KEY?: string;
  HUGGINGFACE_API_KEY?: string;
}

export type Generation = {
  id: number;
  prompt: string;
  model_name: string;
  style: string;
  duration: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audio_url: string | null;
  file_size: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export type GenerateRequest = {
  prompt: string;
  model_name?: string;
  style?: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro';
  duration?: number;
}
