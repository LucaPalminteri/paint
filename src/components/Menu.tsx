"use client";

import React from "react";
import {
  CircleHelp,
  Download,
  FolderOpen,
  Github,
  ImageDown,
  LogIn,
  Menu as MenuIcon,
  Trash2,
  UsersRound,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { motion } from "framer-motion";

const Menu = ({
  clearCanvas,
  saveCanvas,
  setCanvasBackground,
}: {
  clearCanvas: () => void;
  saveCanvas: () => void;
  setCanvasBackground: (color: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute top-2 left-2 z-10"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute top-2 left-2 z-10">
          <Button variant="outline" className="h-8 w-8 p-0">
            <MenuIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ml-2">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <FolderOpen size={16} className="mr-2" />
              <span>Open</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Cmd+O
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={saveCanvas}>
              <Download size={16} className="mr-2" />
              Save to...
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={saveCanvas}>
              <ImageDown size={16} className="mr-2" />
              <span>Export image...</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Cmd+Shift+E
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <UsersRound size={16} className="mr-2" />
              Live collaboration...
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Zap size={16} className="mr-2 text-purple-500" />
              <span className="text-purple-500 font-bold">Command palette</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Cmd+/
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CircleHelp size={16} className="mr-2" />
              <span>Help</span>
              <span className="ml-auto text-xs text-muted-foreground">?</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer" onClick={clearCanvas}>
              <Trash2 size={16} className="mr-2" />
              Reset the canvas
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={"https://github.com/LucaPalminteri/paint"}>
              <DropdownMenuItem className="cursor-pointer">
                <Github size={16} className="mr-2" /> GitHub
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-purple-500 font-bold cursor-pointer">
              <LogIn size={16} className="mr-2 text-purple-500" />
              Sign up
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Canvas background</DropdownMenuLabel>
          <div className="flex space-x-1 px-2 py-1.5">
            {[
              "#ffffff",
              "#f3f4f6",
              "#e5e7eb",
              "#fef3c7",
              "#dbeafe",
              "#d1fae5",
            ].map((color, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-sm border border-gray-300 cursor-pointer`}
                style={{ backgroundColor: color }}
                onClick={() => setCanvasBackground(color)}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default Menu;
