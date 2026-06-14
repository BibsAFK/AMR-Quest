// src/utils/germUtils.js
export function generateSpreadPositions(count, width, height, germSize = 48) {
  if (count <= 0 || width <= 0 || height <= 0) return [];

  const positions = [];
  const edgePadding = Math.max(20, Math.min(72, Math.min(width, height) * 0.08));
  const usableWidth = Math.max(germSize, width - edgePadding * 2);
  const usableHeight = Math.max(germSize, height - edgePadding * 2);

  // Match the grid to the arena shape so wide and tall screens both get used.
  const aspectRatio = usableWidth / usableHeight;
  const cols = Math.max(1, Math.min(count, Math.round(Math.sqrt(count * aspectRatio))));
  const rows = Math.ceil(count / cols);
  const cellWidth = usableWidth / cols;
  const cellHeight = usableHeight / rows;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const itemsInRow = Math.min(cols, count - row * cols);
    const rowOffset = ((cols - itemsInRow) * cellWidth) / 2;

    const jitterX = (Math.random() - 0.5) * Math.min(40, cellWidth * 0.28);
    const jitterY = (Math.random() - 0.5) * Math.min(40, cellHeight * 0.28);

    let x = edgePadding + rowOffset + col * cellWidth + cellWidth / 2 - germSize / 2 + jitterX;
    let y = edgePadding + row * cellHeight + cellHeight / 2 - germSize / 2 + jitterY;

    x = Math.min(Math.max(x, edgePadding), width - germSize - edgePadding);
    y = Math.min(Math.max(y, edgePadding), height - germSize - edgePadding);

    positions.push({ x, y });
  }

  return positions;
}

// Legacy function (kept for compatibility)
export function randomGermPositions(count, width, height) {
  return generateSpreadPositions(count, width, height);
}
