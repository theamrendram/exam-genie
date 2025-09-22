import React from "react";

// Text formatting utility for chat messages
export const formatText = (text: string): React.ReactNode => {
  if (!text) return "";

  // Split text by newlines to handle line breaks
  const lines = text.split("\n");

  return lines.map((line, lineIndex) => {
    if (line.trim() === "") {
      return <br key={lineIndex} />;
    }

    // Process each line for formatting
    const parts = parseLine(line);

    return (
      <span key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (part.type === "text") {
            return <span key={partIndex}>{part.content}</span>;
          } else if (part.type === "bold") {
            return (
              <strong key={partIndex} className="font-bold">
                {part.content}
              </strong>
            );
          } else if (part.type === "italic") {
            return (
              <em key={partIndex} className="italic">
                {part.content}
              </em>
            );
          } else if (part.type === "code") {
            return (
              <code
                key={partIndex}
                className="rounded bg-gray-600 px-1 py-0.5 font-mono text-sm"
              >
                {part.content}
              </code>
            );
          } else if (part.type === "strikethrough") {
            return (
              <del key={partIndex} className="line-through">
                {part.content}
              </del>
            );
          }
          return <span key={partIndex}>{part.content}</span>;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

type TextPart = {
  type: "text" | "bold" | "italic" | "code" | "strikethrough";
  content: string;
};

const parseLine = (line: string): TextPart[] => {
  const parts: TextPart[] = [];
  let currentIndex = 0;

  // Regular expressions for different formatting patterns
  const patterns = [
    { regex: /\*\*\*(.*?)\*\*\*/g, type: "bold" as const }, // ***bold***
    { regex: /\*\*(.*?)\*\*/g, type: "bold" as const }, // **bold**
    { regex: /\*(.*?)\*/g, type: "italic" as const }, // *italic*
    { regex: /`(.*?)`/g, type: "code" as const }, // `code`
    { regex: /~~(.*?)~~/g, type: "strikethrough" as const }, // ~~strikethrough~~
  ];

  // Find all matches
  const matches: Array<{
    start: number;
    end: number;
    content: string;
    type: TextPart["type"];
  }> = [];

  patterns.forEach(({ regex, type }) => {
    let match;
    const regexCopy = new RegExp(regex.source, regex.flags);
    while ((match = regexCopy.exec(line)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        type,
      });
    }
  });

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first one)
  const filteredMatches = matches.filter((match, index) => {
    if (index === 0) return true;
    const previousMatch = matches[index - 1];
    return match.start >= previousMatch.end;
  });

  // Build parts array
  filteredMatches.forEach((match) => {
    // Add text before the match
    if (currentIndex < match.start) {
      const textContent = line.slice(currentIndex, match.start);
      if (textContent) {
        parts.push({ type: "text", content: textContent });
      }
    }

    // Add the formatted match
    parts.push({ type: match.type, content: match.content });
    currentIndex = match.end;
  });

  // Add remaining text
  if (currentIndex < line.length) {
    const textContent = line.slice(currentIndex);
    if (textContent) {
      parts.push({ type: "text", content: textContent });
    }
  }

  // If no formatting found, return the whole line as text
  if (parts.length === 0) {
    parts.push({ type: "text", content: line });
  }

  return parts;
};
