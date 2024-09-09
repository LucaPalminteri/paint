"use client";

import React from "react";
import {
  CircleHelp,
  Download,
  FolderOpen,
  Github,
  ImageDown,
  LogIn,
  Menu,
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

const MenuComponent = ({
  clearCanvas,
  saveCanvas,
  setCanvasBackground,
}: {
  clearCanvas: () => void;
  saveCanvas: () => void;
  setCanvasBackground: (color: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 ml-2">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <FolderOpen size={16} className="mr-2" />
            <span>Open</span>
            <span className="ml-auto text-xs text-muted-foreground">Cmd+O</span>
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
            <span className="ml-auto text-xs text-muted-foreground">Cmd+/</span>
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
          <DropdownMenuItem>
            <Github size={16} className="mr-2" /> GitHub
          </DropdownMenuItem>
          <DropdownMenuItem className="text-purple-500 font-bold">
            <LogIn size={16} className="mr-2 text-purple-500" />
            Sign up
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/*

        <div className="flex justify-between items-center">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <div className="flex justify-between px-2 py-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Light mode</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8">
              <span className="sr-only">Dark mode</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">System mode</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuItem>
          English
          <span className="ml-auto">▼</span>
        </DropdownMenuItem>

        */}
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
  );
};

export default MenuComponent;
