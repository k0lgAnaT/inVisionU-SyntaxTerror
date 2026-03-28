from pathlib import Path

try:
    from docx import Document
except ImportError:
    Document = None


def read_txt_file(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"TXT file not found: {file_path}")

    return path.read_text(encoding="utf-8")


def read_docx_file(file_path: str) -> str:
    if Document is None:
        raise ImportError("python-docx is not installed. Install it with: pip install python-docx")

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"DOCX file not found: {file_path}")

    document = Document(file_path)
    paragraphs = [p.text.strip() for p in document.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def read_candidate_text(txt_path: str, docx_path: str) -> tuple[str, list[str]]:
    parts = []
    loaded_sources = []

    txt_file = Path(txt_path)
    docx_file = Path(docx_path)

    if txt_path and txt_file.is_file():
        parts.append(read_txt_file(txt_path))
        loaded_sources.append(str(txt_file))

    if docx_path and docx_file.is_file():
        parts.append(read_docx_file(docx_path))
        loaded_sources.append(str(docx_file))

    if not parts:
        raise FileNotFoundError(f"No valid input files found at {txt_path} or {docx_path}.")

    combined_text = "\n\n".join(parts)
    return combined_text, loaded_sources