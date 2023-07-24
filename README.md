# React Capture Feedback Component

This is a React component that allows users to capture a section of a website, provide feedback, and report bugs. The captured section is displayed in a frame that can be resized and moved around. Users can enter their feedback in a text area and submit it along with the captured image, the date and the URL.

## Installation

You can install the package from npm using the following command:

```bash
npm i @medanosol/react-feedback-report
```

```base
yarn add @medanosol/react-feedback-report
```

## Usage

To use the component, follow these steps:

1. Import the component into your React application:

```javascript
import { FeedbackReporter } from "@medanosol/react-feedback-report";
```

2. Render the component in your application, passing the necessary props:

```tsx
const App = () => {
  const handleCapture = (captureFeedback) => {
    // Handle the captured feedback data
    console.log(captureFeedback);
  };

  return (
    <div>
      <FeedbackReporter onCapture={handleCapture} />
    </div>
  );
};

export default App;
```

3. Customize the trigger button and feedback input appearance by providing appropriate classes. You can use the feedbackInputClassName prop to add custom classes to the feedback input field.

```tsx
<FeedbackReporter
  trigger={<button className="custom-trigger-button">Capture Feedback</button>}
  feedbackInputClassName="custom-feedback-input"
/>
```

## Props

The component accepts the following props:

```ts
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
```

## Example

Here's an example of how you can use the component:

```tsx
import { FeedbackReporter } from "@medanosol/react-feedback-report";

const App = () => {
  const handleCapture = (FeedbackReporter) => {
    console.log(FeedbackReporter);
  };

  return (
    <div>
      <FeedbackReporter
        trigger={<button>Capture Feedback</button>}
        onCapture={handleCapture}
        feedbackInputClassName="custom-feedback-input"
      />
    </div>
  );
};

export default App;
```
