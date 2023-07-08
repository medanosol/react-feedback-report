import html2canvas from "html2canvas";
import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

interface Props {
  trigger: React.ReactElement<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >;

  onCapture: (image: any, feedback: string) => void;
}
const Component: React.FC<Props> = ({ trigger, onCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [state, setState] = useState({
    width: "200px",
    height: "200px",
    x: 10,
    y: 10,
  });
  useEffect(() => {
    // detect if the textarea is full. if it is, make it bigger
    const textarea = document.querySelector("textarea");
    if (textarea && isCapturing) {
      textarea.addEventListener("input", () => {
        if (textarea.scrollHeight > textarea.clientHeight) {
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      });
    }
  }, [isCapturing]);
  const handleCapture = () => {
    const { width: cropWidth, height: cropHeigth } = state;
    const body = document.querySelector("body");
    const captureSection = document.getElementById("capture-section");
    // hide the capture section
    if (captureSection) {
      captureSection.style.visibility = "hidden";
    }
    if (body) {
      html2canvas(body).then((canvas) => {
        const croppedCanvas = document.createElement("canvas");
        const croppedCanvasContext = croppedCanvas.getContext("2d");
        const croppedCanvasPosition = captureSection?.getBoundingClientRect();
        const cropPositionLeft = croppedCanvasPosition?.left ?? 0;
        const cropPositionTop = croppedCanvasPosition?.top ?? 0;

        croppedCanvas.width = parseInt(cropWidth.replace("px", ""));
        croppedCanvas.height = parseInt(cropHeigth.replace("px", ""));

        if (croppedCanvasContext) {
          croppedCanvasContext.drawImage(
            canvas,
            cropPositionLeft,
            cropPositionTop,
            parseInt(cropWidth.replace("px", "")),
            parseInt(cropHeigth.replace("px", "")),
            0,
            0,
            parseInt(cropWidth.replace("px", "")),
            parseInt(cropHeigth.replace("px", ""))
          );
        }

        if (croppedCanvas) {
          const dataUrl = croppedCanvas.toDataURL();
          // download
          const link = document.createElement("a");
          link.download = "image.png";
          link.href = dataUrl;
          link.click();
          link.remove();
          // show the capture section
          if (captureSection) {
            captureSection.style.visibility = "visible";
          }
        }
      });
    }
  };

  return (
    <>
      {React.Children.map(trigger, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onClick: () => {
              setIsCapturing((capt) => !capt);
            },
          });
        }
        throw new Error("Children must be a valid react element");
      })}
      {isCapturing && (
        <Rnd
          id="capture-section"
          className="relative bg-transparent border-2 border-white border-dashed rounded-t-lg shadow-lg "
          size={{ width: state.width, height: state.height }}
          position={{ x: state.x, y: state.y }}
          onDragStop={(e, d) => {
            setState((state) => {
              return { ...state, x: d.x, y: d.y };
            });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setState({
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            });
          }}
          bounds={"body"}
          minWidth={100}
          minHeight={100}
        >
          <textarea
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
            value={feedback}
            className="absolute w-[calc(100%+4px)] -left-[2px] h-6 bg-white -bottom-[26px] rounded-b-md border-none text-black text-center"
            placeholder="Enter feedback"
          />
          <button
            onClick={handleCapture}
            className="absolute bottom-0 right-0 px-2 py-1 text-center text-black bg-white rounded-bl-md"
          >
            Capture
          </button>
        </Rnd>
      )}
    </>
  );
};

export default Component;
