import os
import re

# Directory containing HTML files
input_dir = "html_files"  # Change to your directory name
output_file = "merged.html"

def extract_tag_content(html, tag):
    """Extracts the content of a specified HTML tag."""
    match = re.search(f"<{tag}.*?>(.*?)</{tag}>", html, re.DOTALL | re.IGNORECASE)
    return match.group(1).strip() if match else ""

# List all HTML files in the directory
html_files = sorted([f for f in os.listdir(input_dir) if f.endswith(".html")])

if not html_files:
    print("No HTML files found.")
    exit()

merged_head = ""
merged_body = ""

for index, file in enumerate(html_files):
    with open(os.path.join(input_dir, file), "r", encoding="utf-8") as f:
        content = f.read()

        if index == 0:  # Take the <head> section from the first file
            merged_head = extract_tag_content(content, "head")

        # Extract <body> content and merge it
        body_content = extract_tag_content(content, "body")
        if body_content:
            merged_body += f"\n<div class='page'>{body_content}</div>\n"

# CSS for multi-page printing layout
css_styles = """
<style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .container { display: flex; flex-wrap: wrap; gap: 10px; padding: 10px; }
    .page { width: 48%; border: 1px solid #ddd; padding: 10px; box-sizing: border-box; }
    @media print {
        .container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .page { break-inside: avoid; page-break-inside: avoid; }
    }
</style>
"""

# Create merged HTML file
merged_html = f"""<!DOCTYPE html>
<html>
<head>
{merged_head}
{css_styles}
</head>
<body>
<div class="container">
{merged_body}
</div>
</body>
</html>
"""

# Save the merged file
with open(output_file, "w", encoding="utf-8") as f:
    f.write(merged_html)

print(f"Merged HTML file created: {output_file}")
