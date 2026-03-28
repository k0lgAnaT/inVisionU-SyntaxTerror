# video_processor.py

import os

def extract_audio(video_path: str, audio_path: str):
    """Extracts audio from a video file using lazy imports."""
    try:
        from moviepy.editor import VideoFileClip
    except ImportError:
        raise ImportError("moviepy is not installed. Install it with: pip install moviepy")

    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")
    
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path, logger=None)
    video.close()

def transcribe_audio(audio_path: str, model_name: str = "openai/whisper-small") -> str:
    """Transcribes audio using lazy imports for torch and transformers."""
    try:
        import torch
        from transformers import pipeline
    except ImportError:
        raise ImportError("torch or transformers not installed. Install with: pip install torch transformers")

    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    pipe = pipeline(
        "automatic-speech-recognition",
        model=model_name,
        device=device
    )
    
    result = pipe(audio_path, generate_kwargs={"task": "transcribe"})
    return result["text"]

def process_video_interview(video_path: str) -> str:
    """Orchestrates video processing with error handling."""
    audio_path = video_path.rsplit(".", 1)[0] + ".temp.mp3"
    
    try:
        print(f"Extracting audio from {video_path}...")
        extract_audio(video_path, audio_path)
        
        print(f"Transcribing audio...")
        transcript = transcribe_audio(audio_path)
        
        if os.path.exists(audio_path):
            os.remove(audio_path)
            
        return transcript
    except Exception as e:
        print(f"Video processing skipped or failed: {e}")
        return ""
