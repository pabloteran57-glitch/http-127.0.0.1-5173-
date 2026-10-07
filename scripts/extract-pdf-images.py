"""Extract unmodified manufacturer PDF images for attribution-preserving research."""
import argparse
from pathlib import Path
from pypdf import PdfReader

parser = argparse.ArgumentParser()
parser.add_argument("pdf", type=Path)
parser.add_argument("prefix", type=Path)
args = parser.parse_args()
for index, asset in enumerate(PdfReader(args.pdf).pages[0].images):
    path = args.prefix.parent / (args.prefix.name + "-" + str(index) + Path(asset.name).suffix)
    path.write_bytes(asset.data)
    print(path)
