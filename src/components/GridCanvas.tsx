import { Grid } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  showGrid: boolean;
  setShowGrid: (showGrid: boolean) => void;
};

const GridCanvas = ({ showGrid, setShowGrid }: Props) => {
  return (
    <div className="absolute bottom-2 right-2 z-10 rounded-md">
      <Button
        variant="outline"
        onClick={() => setShowGrid(!showGrid)}
        className="p-2"
      >
        <Grid className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default GridCanvas;
