import React from 'react';

const Loader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[40vh] w-full">
    <div className="flex space-x-2">
      <span className="block w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
      <span className="block w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
      <span className="block w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
    </div>
  </div>
);

export default Loader; 