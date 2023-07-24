import clsx from "clsx";
import html2canvas from "html2canvas";
import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

interface CaptureFeedback {
  image: string;
  feedback: string;
  date: Date;
  path: string;
}

interface Props {
  trigger: React.ReactElement<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >;
  onCapture: (captureFeedback: CaptureFeedback) => void;
  initialPosition?: {
    width: string;
    height: string;
    x: number;
    y: number;
  };
  inputClassName?: string;
  inputPlaceholder?: string;
  buttonClassName?: string;
  captureSectionClassName?: string;
  buttonIcon?: React.ReactNode;
}

const FeedbackReport: React.FC<Props> = ({
  trigger,
  onCapture,
  initialPosition = {
    width: "200px",
    height: "200px",
    x: 0,
    y: 0,
  },
  inputClassName,
  inputPlaceholder = "Enter feedback...",
  buttonClassName,
  captureSectionClassName,
  buttonIcon,
}) => {
  // generic function to get the value of a css variable and parse it to int
  const parseValueToInt = (value: string) => {
    return parseInt(value.replace("px", "").replace("%", ""));
  };

  // add ! at the beggining of each className
  useEffect(() => {
    const addExclamationMark = (className?: string) => {
      return className
        ?.split(" ")
        .map((className) => {
          return `!${className}`;
        })
        .join(" ");
    };

    inputClassName = addExclamationMark(inputClassName);
    buttonClassName = addExclamationMark(buttonClassName);
    captureSectionClassName = addExclamationMark(captureSectionClassName);
  }, [inputClassName, buttonClassName, captureSectionClassName]);

  const [isDragging, setIsDragging] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [state, setState] = useState(initialPosition);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setState({
        width: "200px",
        height: "200px",
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
      });
    }
  }, []);
  useEffect(() => {
    const textarea = document.querySelector("textarea");

    const handleTextAreaHeight = () => {
      if (textarea && isCapturing) {
        // remove unnecessary height and recalculate the necessary height
        textarea.style.height = "0px";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    textarea?.addEventListener("input", () => {
      handleTextAreaHeight();
    });
    if (isCapturing) {
      handleTextAreaHeight();
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", () => {
          handleTextAreaHeight();
        });
      }
    };
  }, [isCapturing, state.height, state.width]);

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
        if (!croppedCanvasPosition) return;
        const cropPositionLeft = croppedCanvasPosition.left ?? 0;
        const cropPositionTop = croppedCanvasPosition.top + window.scrollY ?? 0;

        croppedCanvas.width = parseValueToInt(cropWidth);
        croppedCanvas.height = parseValueToInt(cropHeigth);

        if (croppedCanvasContext) {
          croppedCanvasContext.drawImage(
            canvas,
            cropPositionLeft,
            cropPositionTop,
            parseValueToInt(cropWidth),
            parseValueToInt(cropHeigth),
            0,
            0,
            parseValueToInt(cropWidth),
            parseValueToInt(cropHeigth)
          );
        }

        if (croppedCanvas) {
          const dataUrl = croppedCanvas.toDataURL();

          onCapture({
            image: dataUrl,
            feedback,
            date: new Date(),
            path: window.location.pathname,
          });
          // reset the state
          setIsCapturing(false);
          setFeedback("");
          if (typeof window !== "undefined") {
            setState({
              width: "200px",
              height: "200px",
              x: window.innerWidth / 2 - 100,
              y: window.innerHeight / 2 - 100,
            });
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
        throw new Error("Children must be a valid React element");
      })}

      {isCapturing && (
        <Rnd
          id="capture-section"
          className={clsx(
            "border-2 border-white  rounded-t-lg shadow-lg ",
            captureSectionClassName && captureSectionClassName
          )}
          style={{
            borderStyle: "dashed",
            zIndex: 1000000,
            background: "none",
            boxShadow: "0 0 0 100vmax rgba(0,0,0,0.5)",
          }}
          dragGrid={[20, 20]}
          size={{ width: state.width, height: state.height }}
          position={{ x: state.x, y: state.y }}
          onDragStop={(_, d) => {
            setIsDragging(false);
            setState((state) => {
              return { ...state, x: d.x, y: d.y };
            });
          }}
          onResizeStop={(_, __, ref, ___, position) => {
            setState({
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            });
          }}
          bounds={"window"}
          minWidth={100}
          minHeight={100}
        >
          <textarea
            id="feedback-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
            value={feedback}
            className={clsx(
              " absolute -left-[2px] h-6 bg-white -bottom-1 translate-y-full rounded-b-md border-none text-black text-center px-1",
              inputClassName && inputClassName
            )}
            style={{
              opacity: isDragging ? 0.1 : 1,
              resize: "none",
              width: "calc(100% + 4px)",
            }}
            placeholder={inputPlaceholder}
          />
          <button
            onClick={() => {
              if (!feedback) return;
              handleCapture();
            }}
            disabled={!feedback}
            style={{
              opacity: isDragging ? 0.1 : 1,
            }}
            className={clsx(
              "absolute flex items-center justify-center w-10 h-10 p-1 bg-white rounded-full right-1 top-1 aspect-square disabled:bg-slate-400 disabled:cursor-not-allowed",
              buttonClassName && buttonClassName
            )}
          >
            {buttonIcon ? (
              buttonIcon
            ) : (
              <svg
                id="Layer_1"
                version="1.1"
                viewBox="0 0 30 30"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M6,19V17c0-0.552-0.448-1-1-1H5c-0.552,0-1,0.448-1,1V19c0,0.552,0.448,1,1,1H5C5.552,20,6,19.552,6,19z" />
                  <path d="M10,5L10,5c0,0.553,0.448,1,1,1H13c0.552,0,1-0.448,1-1V5c0-0.552-0.448-1-1-1H11C10.448,4,10,4.448,10,5z" />
                  <path d="M5,14L5,14c0.553,0,1-0.448,1-1V11c0-0.552-0.448-1-1-1H5c-0.552,0-1,0.448-1,1V13C4,13.552,4.448,14,5,14z" />
                  <path d="M23,6h1l0,1c0,0.552,0.448,1,1,1h0c0.552,0,1-0.448,1-1V6c0-1.105-0.895-2-2-2h-1c-0.552,0-1,0.448-1,1v0   C22,5.552,22.448,6,23,6z" />
                  <path d="M16,5L16,5c0,0.552,0.448,1,1,1h2c0.552,0,1-0.448,1-1v0c0-0.552-0.448-1-1-1h-2C16.448,4,16,4.448,16,5z" />
                  <path d="M7,24H6v-1c0-0.552-0.448-1-1-1H5c-0.552,0-1,0.448-1,1v1c0,1.105,0.895,2,2,2h1c0.552,0,1-0.448,1-1V25   C8,24.448,7.552,24,7,24z" />
                  <path d="M6,7V6h1c0.552,0,1-0.448,1-1V5c0-0.552-0.448-1-1-1H6C4.895,4,4,4.895,4,6v1c0,0.552,0.448,1,1,1H5C5.552,8,6,7.552,6,7z" />
                  <path d="M24,11l0,2.001c0,0.552,0.448,1,1,1h0c0.552,0,1-0.448,1-1V11c0-0.552-0.448-1-1-1h0C24.448,10,24,10.448,24,11z" />
                </g>
                <g>
                  <path d="M25,16h-1.764c-0.758,0-1.45-0.428-1.789-1.106l-0.171-0.342C21.107,14.214,20.761,14,20.382,14h-4.764   c-0.379,0-0.725,0.214-0.894,0.553l-0.171,0.342C14.214,15.572,13.521,16,12.764,16H11c-0.552,0-1,0.448-1,1v8c0,0.552,0.448,1,1,1   h14c0.552,0,1-0.448,1-1v-8C26,16.448,25.552,16,25,16z M18,25c-2.209,0-4-1.791-4-4c0-2.209,1.791-4,4-4s4,1.791,4,4   C22,23.209,20.209,25,18,25z" />
                  <circle cx="18" cy="21" r="2" />
                </g>
              </svg>
            )}
          </button>
        </Rnd>
      )}
    </>
  );
};

export default FeedbackReport;
