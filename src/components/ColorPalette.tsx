import { COLOR_PALETTE } from "@/data/constants";

interface ColorPaletteProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
}

export default function ColorPalette({
  primaryColor,
  setPrimaryColor,
  setSecondaryColor,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex space-x-1 gap-1">
        {COLOR_PALETTE.slice(0, Math.ceil(COLOR_PALETTE.length / 2)).map(
          (paletteColor) => (
            <button
              key={paletteColor}
              className={`w-5 h-5 rounded-full ${
                primaryColor === paletteColor
                  ? "ring-1 ring-offset-1 ring-blue-500"
                  : ""
              }`}
              style={{ backgroundColor: paletteColor }}
              onClick={() => setPrimaryColor(paletteColor)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSecondaryColor(paletteColor);
              }}
            />
          ),
        )}
      </div>
      <div className="flex space-x-1 gap-1">
        {COLOR_PALETTE.slice(Math.ceil(COLOR_PALETTE.length / 2)).map(
          (paletteColor) => (
            <button
              key={paletteColor}
              className={`w-5 h-5 rounded-full ${
                primaryColor === paletteColor
                  ? "ring-1 ring-offset-1 ring-blue-500"
                  : ""
              }`}
              style={{ backgroundColor: paletteColor }}
              onClick={() => setPrimaryColor(paletteColor)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSecondaryColor(paletteColor);
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}
