# React Capture Feedback Component

This is a React component that allows users to capture a section of a website, provide feedback, and report bugs. The captured section is displayed in a frame that can be resized and moved around. Users can enter their feedback in a text area and submit it along with the captured image.

## Installation

You can install the package from npm using the following command:

```bash
npm install <package-name>
```

```base
yarn add <package-name>
```

## Usage

To use the component, follow these steps:

1. Import the component into your React application:

   ```javascript
   import CaptureFeedback from "<package-name>";
   ```

2. Render the component in your application, passing the necessary props:

```jsx
const App = () => {
  const handleCapture = (captureFeedback) => {
    // Handle the captured feedback data
    console.log(captureFeedback);
  };

  return (
    <div>
      <CaptureFeedback
        trigger={<button>Capture Feedback</button>}
        onCapture={handleCapture}
        feedbackInputClassName="custom-feedback-input"
      />
    </div>
  );
};

export default App;
```

3. Customize the trigger button and feedback input appearance by providing appropriate classes. You can use the feedbackInputClassName prop to add custom classes to the feedback input field.

```jsx
<CaptureFeedback
  trigger={<button className="custom-trigger-button">Capture Feedback</button>}
  feedbackInputClassName="custom-feedback-input"
/>
```

## Props

The component accepts the following props:

- trigger (required): A React element that acts as the trigger button to initiate the feedback capture.
- onCapture (required): A callback function that receives the captured feedback data when the user submits it.
- feedbackInputClassName (optional): Additional CSS classes to apply to the feedback input field.

## Example

Here's an example of how you can use the component:

```jsx
import React from "react";
import CaptureFeedback from "<package-name>";

const App = () => {
  const handleCapture = (captureFeedback) => {
    console.log(captureFeedback);
  };

  return (
    <div>
      <CaptureFeedback
        trigger={<button>Capture Feedback</button>}
        onCapture={handleCapture}
        feedbackInputClassName="custom-feedback-input"
      />
    </div>
  );
};

export default App;
```
