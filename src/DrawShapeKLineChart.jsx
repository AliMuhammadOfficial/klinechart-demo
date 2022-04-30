import React, { useEffect } from "react";
import { init, dispose } from "klinecharts";
import { checkCoordinateOnSegment } from "klinecharts/lib/shape/shapeHelper";
import generatedKLineDataList from "./utils/generatedKLineDataList";
import Layout from "./Layout";

const rect = {
  name: "rect",
  totalStep: 3,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    return checkCoordinateOnSegment(
      dataSource[0],
      dataSource[1],
      eventCoordinate
    );
  },
  createShapeDataSource: ({ coordinates }) => {
    if (coordinates.length === 2) {
      return [
        {
          type: "line",
          isDraw: false,
          isCheck: true,
          dataSource: [
            [
              { ...coordinates[0] },
              { x: coordinates[1].x, y: coordinates[0].y },
            ],
            [
              { x: coordinates[1].x, y: coordinates[0].y },
              { ...coordinates[1] },
            ],
            [
              { ...coordinates[1] },
              { x: coordinates[0].x, y: coordinates[1].y },
            ],
            [
              { x: coordinates[0].x, y: coordinates[1].y },
              { ...coordinates[0] },
            ],
          ],
        },
        {
          type: "polygon",
          isDraw: true,
          isCheck: false,
          styles: { style: "fill" },
          dataSource: [
            [
              { ...coordinates[0] },
              { x: coordinates[1].x, y: coordinates[0].y },
              { ...coordinates[1] },
              { x: coordinates[0].x, y: coordinates[1].y },
            ],
          ],
        },
        {
          type: "polygon",
          isDraw: true,
          isCheck: false,
          dataSource: [
            [
              { ...coordinates[0] },
              { x: coordinates[1].x, y: coordinates[0].y },
              { ...coordinates[1] },
              { x: coordinates[0].x, y: coordinates[1].y },
            ],
          ],
        },
      ];
    }
    return [];
  },
};

const circle = {
  name: "circle",
  totalStep: 3,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    const xDis = Math.abs(dataSource.x - eventCoordinate.x);
    const yDis = Math.abs(dataSource.y - eventCoordinate.y);
    const r = Math.sqrt(xDis * xDis + yDis * yDis);
    return Math.abs(r - dataSource.radius) < 3;
  },
  createShapeDataSource: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x);
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y);
      const radius = Math.sqrt(xDis * xDis + yDis * yDis);
      return [
        {
          type: "arc",
          isDraw: true,
          isCheck: false,
          styles: { style: "fill" },
          dataSource: [
            { ...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ],
        },
        {
          type: "arc",
          isDraw: true,
          isCheck: true,
          dataSource: [
            { ...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ],
        },
      ];
    }
    return [];
  },
};

const drawLines = [
  { key: "priceLine", text: "Price Line" },
  { key: "priceChannelLine", text: "Price Channel Line" },
  { key: "parallelStraightLine", text: "Parallel Straight Line" },
  { key: "fibonacciLine", text: "Fibonacci Line" },
  { key: "rect", text: "Rect" },
  { key: "circle", text: "Circle" },
];

export default function DrawGraphMarkKLineChart() {
  let kLineChart;
  useEffect(() => {
    kLineChart = init("draw-shape-k-line");
    kLineChart.addShapeTemplate([rect, circle]);
    kLineChart.applyNewData(generatedKLineDataList());
    return () => {
      dispose("draw-shape-k-line");
    };
  }, []);

  return (
    <Layout title="Drawing on KLine Chart">
      <div id="draw-shape-k-line" className="k-line-chart" />
      <div className="k-line-chart-menu-container">
        {drawLines.map(({ key, text }) => {
          return (
            <button
              key={key}
              onClick={(_) => {
                kLineChart.createShape(key);
              }}
            >
              {text}
            </button>
          );
        })}
        <button
          onClick={() => {
            kLineChart.removeShape();
          }}
        >
          Clear
        </button>
      </div>
    </Layout>
  );
}
