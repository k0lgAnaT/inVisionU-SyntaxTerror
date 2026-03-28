import os
import json
from pathlib import Path

# Fix for Keras 3 / Transformers compatibility
os.environ["USE_TF"] = "0"
os.environ["USE_TORCH"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

def main():
    candidate_id = "A-001"
    
    # Imports inside main for faster startup and dependency safety
    from config import INPUT_TXT_PATH, INPUT_DOCX_PATH, OUTPUT_JSON_PATH
    from file_reader import read_candidate_text
    from video_processor import process_video_interview
    from scorer import process_source_report
    from aggregator import aggregate_production_results

    all_reports = []

    # 1. Process Essays/Documents (Required but safe fallback)
    try:
        print(f"--- Processing documents for {candidate_id} ---")
        doc_text, loaded_files = read_candidate_text(INPUT_TXT_PATH, INPUT_DOCX_PATH)
        all_reports.append(process_source_report(candidate_id, "essay_letter", doc_text, loaded_files))
    except Exception as e:
        print(f"File reading skipped: {e}")
        # Test candidate fallback
        test_text = "I am highly motivated to join your university. I leading many projects."
        all_reports.append(process_source_report(candidate_id, "essay_letter", test_text, ["INTERNAL_TEST_SOURCE"]))

    # 2. Process Video Interview (Safe)
    video_path = "input/candidate_interview.mp4"
    if os.path.exists(video_path):
        transcript = process_video_interview(video_path)
        if transcript:
            all_reports.append(process_source_report(candidate_id, "video_interview", transcript, [video_path]))
    
    # 3. Process Interview Notes (Safe)
    interview_doc_path = "input/interview_notes.txt"
    if os.path.exists(interview_doc_path):
        try:
            it_text, it_files = read_candidate_text(interview_doc_path, "")
            all_reports.append(process_source_report(candidate_id, "interview_document", it_text, it_files))
        except Exception:
            pass

    # 4. Aggregation
    print("--- Aggregating all results ---")
    final_assessment = aggregate_production_results(all_reports)
    
    # 5. Output
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(final_assessment, f, indent=4, ensure_ascii=False)
    
    print("\n" + "="*40)
    print(f"FINAL REPORT: {OUTPUT_JSON_PATH}")
    print(f"STATUS: {final_assessment.get('recommendation')}")
    print(f"SCORE: {final_assessment.get('final_score')}")
    print("="*40)
    print(json.dumps(final_assessment, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()