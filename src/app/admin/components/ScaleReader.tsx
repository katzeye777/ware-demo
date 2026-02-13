'use client';

import { useState } from 'react';

/**
 * Interface for USB scale reading data
 * Future implementation will integrate with USB HID scale devices
 */
export interface ScaleReading {
  weight_g: number;
  unit: string;
  stable: boolean;
  timestamp?: Date;
}

/**
 * Future hardware integration pattern:
 *
 * This component will interface with a browser-based USB driver/plugin
 * that communicates with USB scales using the WebUSB API or a native bridge.
 *
 * Expected driver interface:
 * - scaleDriver.connect(vendorId, productId) -> Promise<ScaleDevice>
 * - scaleDevice.onReading((reading: ScaleReading) => void)
 * - scaleDevice.tare() -> Promise<void>
 * - scaleDevice.disconnect() -> Promise<void>
 *
 * Supported scale protocols:
 * - Generic USB HID scales
 * - Common laboratory scale models (Mettler Toledo, Ohaus, etc.)
 * - Industrial batching scales
 */

interface ScaleReaderProps {
  onReading?: (reading: ScaleReading) => void;
  className?: string;
}

export default function ScaleReader({ onReading, className = '' }: ScaleReaderProps) {
  const [connected, setConnected] = useState(false);
  const [currentReading, setCurrentReading] = useState<ScaleReading | null>(null);

  const handleConnect = async () => {
    // TODO: Implement USB scale connection
    // Example future implementation:
    /*
    try {
      const device = await scaleDriver.connect();
      device.onReading((reading: ScaleReading) => {
        setCurrentReading(reading);
        if (onReading) {
          onReading(reading);
        }
      });
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect to scale:', error);
    }
    */
    alert('USB Scale integration coming soon!');
  };

  const handleTare = async () => {
    // TODO: Implement tare function
    alert('Tare function will be available when scale is connected');
  };

  return (
    <div className={`bg-gray-50 border-2 border-gray-300 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          USB Scale Integration
        </h3>
        {connected && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
            Connected
          </span>
        )}
      </div>

      {!connected ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Connect a USB scale for automatic weight reading during batching operations.
          </p>
          <button
            onClick={handleConnect}
            disabled={true}
            className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed relative group"
          >
            Connect Scale
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Coming Soon
            </span>
          </button>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Future Feature:</strong> Automatic weight reading will be available in a
              future update. This will support common USB HID scales and laboratory balance
              equipment.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
            <div className="text-5xl font-bold text-gray-900 font-mono mb-2">
              {currentReading?.weight_g.toFixed(2) || '0.00'}
              <span className="text-2xl text-gray-600 ml-2">g</span>
            </div>
            {currentReading?.stable ? (
              <span className="text-sm text-green-600 font-semibold">● STABLE</span>
            ) : (
              <span className="text-sm text-yellow-600 font-semibold">○ Weighing...</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleTare}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Tare
            </button>
            <button
              onClick={() => setConnected(false)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1">
          <strong>Supported Devices:</strong> Generic USB HID scales, Mettler Toledo, Ohaus
        </p>
        <p>
          <strong>Requirements:</strong> USB connection, WebUSB support or native bridge
        </p>
      </div>
    </div>
  );
}
