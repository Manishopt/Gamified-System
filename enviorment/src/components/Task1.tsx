import { useState, useRef, useEffect } from "react";
import type { UserType } from '../App';
import PlantAnimation from './PlantAnimation';
type CurrentPage = 'login' | 'landing' | 'dashboard' | 'study' | 'tasks' | 'achievements' | 'task1';

interface Task1Props {
  userType: UserType;
  onNavigate: (page: CurrentPage) => void;
}


interface Point {
  x: number;
  y: number;
}

interface PlantRecord {
  date: string;
  pixels: number;
  heightCm: number;
  scaleCmPerPixel: number;
  imageName: string;
}

interface Plant {
  id: string;
  name: string;
  coins: number;
  records: PlantRecord[];
}


interface PointsState {
  refA: Point | null;
  refB: Point | null;
  plantBase: Point | null;
  plantTip: Point | null;
}

export default function PlantGrowthTracker({ userType, onNavigate }: Task1Props) {
  // Use the userType and onNavigate props as needed
  console.log('Current user type:', userType);
  const [plants, setPlants] = useState<Plant[]>(() => {
    try {
      const saved = localStorage.getItem("plants_v1");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedPlantId, setSelectedPlantId] = useState<string>("");
  const [newPlantName, setNewPlantName] = useState<string>("");

  // Upload / image / measurement states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [clickStage, setClickStage] = useState<number>(0); // 0 = pick reference pt1, 1 = ref pt2, 2 = plant base, 3 = plant tip, 4 = done
  const [points, setPoints] = useState<PointsState>({ 
    refA: null, 
    refB: null, 
    plantBase: null, 
    plantTip: null 
  });
  const [refLengthCm, setRefLengthCm] = useState<number>(30); // default example reference (cm)
  const [scaleCmPerPixel, setScaleCmPerPixel] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState<PlantRecord[]>([]); // temp for current upload
  const [plantGrowthProgress, setPlantGrowthProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem("plants_v1", JSON.stringify(plants));
  }, [plants]);

  // redraw whenever image or points change
  useEffect(() => {
    drawCanvas();
    
    // Update plant growth progress based on measurement stage
    let progress = 0;
    if (clickStage >= 1) progress = 0.3;  // After first reference point
    if (clickStage >= 2) progress = 0.5;  // After second reference point
    if (clickStage >= 3) progress = 0.7;  // After plant base
    if (clickStage >= 4) progress = 1.0;  // After plant tip
    
    setPlantGrowthProgress(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, points, scaleCmPerPixel, clickStage]);

  function createPlant() {
    if (!newPlantName.trim()) return;
    const newPlant = {
      id: "p_" + Date.now(),
      name: newPlantName.trim(),
      coins: 0,
      records: [] // { date, heightCm, pixels, scaleCmPerPixel, imageName }
    };
    setPlants((s) => [newPlant, ...s]);
    setNewPlantName("");
    setSelectedPlantId(newPlant.id);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      if (typeof ev.target?.result === 'string') {
        setImageSrc(ev.target.result);
        setClickStage(0);
        setPoints({ refA: null, refB: null, plantBase: null, plantTip: null });
        setScaleCmPerPixel(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // helper: compute Euclidean distance
  const distance = (a: Point, b: Point): number => {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  };

  // Calculate scale (cm per pixel) based on reference points
  const calculateScale = (): number | null => {
    if (!points.refA || !points.refB) return null;
    const pixels = distance(points.refA, points.refB);
    return refLengthCm / pixels;
  };

  // Helper function to compute distance between two points
  const computeDistance = (a: Point, b: Point): number => {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  };

  // Helper function to compute scale synchronously
  const computeScaleSync = (a: Point, b: Point): number => {
    const pixels = distance(a, b);
    const scale = refLengthCm / pixels;
    setScaleCmPerPixel(scale);
    return scale;
  };

  function finalizeMeasurement(base: Point, tip: Point) {
    // get a reliable scale: prefer state, otherwise compute from ref points
    let scale = scaleCmPerPixel;
    if (!scale && points.refA && points.refB) {
      scale = calculateScale();
    }
    if (!base || !tip || !scale) {
      alert("Please mark reference points (A & B) and plant base & tip first.");
      return;
    }
    const pixels = computeDistance(base, tip);
    const heightCm = pixels * scale;
    const record = {
      date: new Date().toISOString(),
      pixels: Math.round(pixels),
      heightCm: Number(heightCm.toFixed(2)),
      scaleCmPerPixel: Number(scale.toFixed(4)),
      imageName: imageFileName || "uploaded"
    };
    setMeasurements([record]);
  }

  function saveMeasurementToPlant() {
    if (!selectedPlantId || measurements.length === 0) {
      alert("Select a plant and complete a measurement first.");
      return;
    }
    const plantIdx = plants.findIndex((p) => p.id === selectedPlantId);
    if (plantIdx === -1) return;

    const plant = { ...plants[plantIdx] };
    const prevRecord = (plant.records && plant.records[0]) || null; // latest record stored at index 0
    const current = measurements[0];

    let growth = null;
    if (prevRecord) growth = Number((current.heightCm - prevRecord.heightCm).toFixed(2));

    // award coins based on growth
    let earned = 0;
    if (growth === null) {
      // first record -> small onboarding coins
      earned = 50;
    } else if (growth >= 5) earned = 150;
    else if (growth >= 2) earned = 75;
    else if (growth > 0) earned = 25;
    else earned = 5; // no growth / negligible

    plant.coins = (plant.coins || 0) + earned;
    plant.records = [current, ...(plant.records || [])];

    const newPlants = [...plants];
    newPlants[plantIdx] = plant;
    setPlants(newPlants);

    // reset upload state
    setImageSrc(null);
    setImageFileName("");
    setPoints({ refA: null, refB: null, plantBase: null, plantTip: null });
    setClickStage(0);
    setMeasurements([]);
    setScaleCmPerPixel(null);

    alert(`Measurement saved. Earned ${earned} eco-coins. Growth: ${growth === null ? "N/A" : growth + " cm"}`);
  }

  // Convert click coordinates on the displayed image to image natural pixel coordinates
  function getImageCoordsFromEvent(e: React.MouseEvent<HTMLCanvasElement>): Point | null {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return null;
    const rect = canvas.getBoundingClientRect();
    // position inside displayed element
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    // map to natural pixels
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const x = dx * scaleX;
    const y = dy * scaleY;
    return { x, y };
  }

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const pos = getImageCoordsFromEvent(e);
    if (!pos) return;

    if (clickStage === 0) {
      setPoints((prev) => ({ ...prev, refA: pos }));
      setClickStage(1);
      return;
    }

    if (clickStage === 1) {
      setPoints((prev) => {
        const a = prev.refA;
        const newP = { ...prev, refB: pos };
        // compute scale immediately if we have refA
        if (a) computeScaleSync(a, pos);
        return newP;
      });
      setClickStage(2);
      return;
    }

    if (clickStage === 2) {
      setPoints((prev) => ({ ...prev, plantBase: pos }));
      setClickStage(3);
      return;
    }

    if (clickStage === 3) {
      setPoints((prev) => {
        const base = prev.plantBase;
        const newP = { ...prev, plantTip: pos };
        // finalize measurement now using base and tip; this function will compute/fallback scale if needed
        if (base) finalizeMeasurement(base, pos);
        return newP;
      });
      setClickStage(4);
      return;
    }

    // if clickStage >=4 we reset cycle when user clicks again
    if (clickStage >= 4) {
      setPoints({ refA: null, refB: null, plantBase: null, plantTip: null });
      setClickStage(0);
      setScaleCmPerPixel(null);
      setMeasurements([]);
    }
  }

  function drawCanvas() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    // set canvas intrinsic size to natural image size so drawing coordinates match natural pixels
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    // scale canvas to displayed size so it visually overlays the image
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // semi-transparent overlay (so points are visible regardless of image)
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawPoint = (pt: Point | null, color: string) => {
      if (!pt) return;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    };

    const drawLine = (a: Point | null, b: Point | null, color: string, width = 6) => {
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
    };

    drawLine(points.refA, points.refB, "#FFD700", 6);
    drawPoint(points.refA, "#FFD700");
    drawPoint(points.refB, "#FFD700");

    drawLine(points.plantBase, points.plantTip, "#34D399", 6);
    drawPoint(points.plantBase, "#34D399");
    drawPoint(points.plantTip, "#34D399");

    // draw small overlay text (use light color for visibility)
    // Draw measurement instructions with better visibility
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    
    // Draw text background for better readability
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(8, 8, 400, 70);
    
    // Draw border
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 400, 70);
    
    // Draw text
    ctx.fillStyle = '#065F46';
    ctx.font = "bold 14px Arial";
    ctx.fillText("MEASUREMENT STEPS:", 20, 30);
    
    ctx.font = "13px Arial";
    ctx.fillStyle = '#1F2937';
    ctx.fillText("1. Mark Reference Points A & B (e.g., ends of a ruler)", 20, 50);
    ctx.fillText("2. Mark Plant Base & Tip to measure height", 20, 70);
    
    // Draw scale information if available
    if (scaleCmPerPixel) {
      ctx.fillStyle = '#1E40AF';
      ctx.font = "bold 12px Arial";
      ctx.fillText(`Scale: ${scaleCmPerPixel.toFixed(4)} cm/pixel`, 20, 90);
      
      // Draw current stage indicator
      const stages = ["Reference A", "Reference B", "Plant Base", "Plant Tip"];
      if (clickStage < 4) {
        ctx.fillStyle = '#B91C1C';
        ctx.fillText(`Next: ${stages[clickStage]}`, 180, 30);
      } else {
        ctx.fillStyle = '#065F46';
        ctx.fillText("✓ Measurement Complete!", 180, 30);
      }
    }
  }

  const handleBackClick = () => {
    onNavigate('tasks'); // Navigate back to the tasks page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={handleBackClick}
          className="mb-6 flex items-center text-green-700 hover:text-green-900 transition-colors duration-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md border border-green-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Tasks
        </button>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-green-100 flex-1">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <h1 className="text-3xl font-bold">🌱 Plant Growth Tracker</h1>
              <p className="text-green-100 mt-1">Track your plant's journey and earn eco-rewards!</p>
            </div>
            <div className="p-6">
              <section className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Register New Plant
                </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter plant name (e.g., Mango Sapling)"
                value={newPlantName}
                onChange={(e) => setNewPlantName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createPlant()}
              />
            </div>
            <button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              onClick={createPlant}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Plant
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Or select existing plant</label>
            <div className="relative">
              <select
                className="appearance-none w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                value={selectedPlantId || ""}
                onChange={(e) => setSelectedPlantId(e.target.value)}
              >
                <option value="">-- Select a plant to track --</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.coins || 0} 🌱 coins
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Upload & Measure
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-green-400 bg-gray-50">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-3">Upload a clear photo of your plant with a reference object</p>
                  <label className="cursor-pointer bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Choose Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden"
                    />
                  </label>
                  {imageFileName && (
                    <p className="text-sm text-green-600 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {imageFileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <label className="block text-sm font-medium text-blue-800 mb-2">📏 Reference Object Length</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="border border-blue-200 rounded-l-lg p-2.5 w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={refLengthCm}
                    min="1"
                    step="0.1"
                    onChange={(e) => setRefLengthCm(Number(e.target.value) || 1)}
                  />
                  <span className="bg-blue-100 text-blue-800 px-3 py-2.5 rounded-r-lg border-t border-b border-r border-blue-200">cm</span>
                </div>
                <p className="text-xs text-blue-600 mt-2">💡 Place a ruler or object of known length in your photo, then mark its ends as reference points.</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How to Measure
                </h3>
                <ol className="space-y-2 text-sm text-amber-700">
                  <li className="flex items-start">
                    <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">1</span>
                    Upload a clear photo with a reference object (ruler/coin) visible
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">2</span>
                    Click to mark points: <span className="font-semibold mx-1 text-amber-900">Reference A → Reference B</span> (ends of reference object)
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">3</span>
                    Then click: <span className="font-semibold mx-1 text-amber-900">Plant Base → Plant Tip</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">4</span>
                    Click "Save Measurement" to calculate height and earn coins
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  onClick={() => {
                    setImageSrc(null);
                    setImageFileName("");
                    setPoints({ refA: null, refB: null, plantBase: null, plantTip: null });
                    setClickStage(0);
                    setScaleCmPerPixel(null);
                    setMeasurements([]);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start Over
                </button>
                <button
                  className={`flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                    measurements.length 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={saveMeasurementToPlant}
                  disabled={measurements.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Measurement
                </button>
              </div>

              {imageFileName && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Measurement Progress</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        imageFileName ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {imageFileName ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>1</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Image Uploaded</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{imageFileName}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        scaleCmPerPixel ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {scaleCmPerPixel ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>2</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Scale Calibration</p>
                        <p className="text-xs text-gray-500">
                          {scaleCmPerPixel 
                            ? `${scaleCmPerPixel.toFixed(4)} cm/pixel` 
                            : 'Mark reference points to set scale'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        measurements[0] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {measurements[0] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>3</span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">Plant Measurement</p>
                        <p className="text-xs text-gray-500">
                          {measurements[0] 
                            ? `Height: ${measurements[0].heightCm} cm` 
                            : clickStage >= 2 ? 'Mark plant base and tip' : 'Complete previous steps first'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {measurements[0] && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-green-800">Measurement Complete!</h4>
                          <div className="mt-1 text-sm text-green-700">
                            <p>Height: <span className="font-semibold">{measurements[0].heightCm} cm</span></p>
                            <p className="text-xs opacity-80">Scale: {scaleCmPerPixel?.toFixed(4)} cm/pixel</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden relative bg-gray-50" style={{ minHeight: 300 }}>
                {imageSrc ? (
                  <div style={{ position: "relative", width: '100%', height: '100%' }}>
                    <img
                      ref={imgRef}
                      src={imageSrc}
                      alt="Plant measurement preview"
                      onLoad={() => {
                        // ensure we redraw on load and reset overlay sizing
                        drawCanvas();
                      }}
                      className="w-full h-full object-contain bg-white"
                      style={{ display: 'block' }}
                    />
                    <canvas
                      ref={canvasRef}
                      onClick={onCanvasClick}
                      className="absolute inset-0 w-full h-full cursor-crosshair"
                    />
                    
                    {/* Measurement guide overlay */}
                    {clickStage < 4 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                          {clickStage === 0 && 'Click to mark Reference Point A'}
                          {clickStage === 1 && 'Click to mark Reference Point B'}
                          {clickStage === 2 && 'Click to mark Plant Base'}
                          {clickStage === 3 && 'Click to mark Plant Tip'}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Upload an image to begin measurement</p>
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP (max 10MB)</p>
                  </div>
                )}
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-sm font-medium text-purple-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Use a ruler or coin as your reference object for accurate scaling
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    For best results, photograph plants against a contrasting background
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    Track growth over time by measuring weekly or monthly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Your Plants & Growth History
            </h2>
          </div>
          
          <div className="p-6">
            {plants.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No plants yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by registering your first plant above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {plants.map((p) => (
                  <div key={p.id} className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    selectedPlantId === p.id ? 'ring-2 ring-green-500 border-green-300' : 'border-gray-200 hover:border-green-200'
                  }`}>
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {p.coins || 0} Eco-Coins
                              </span>
                              <span className="mx-2">•</span>
                              <span>{p.records?.length || 0} measurements</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedPlantId(p.id)}
                            className={`px-3 py-1.5 text-sm rounded-lg flex items-center ${
                              selectedPlantId === p.id 
                                ? 'bg-green-100 text-green-800' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {selectedPlantId === p.id ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Selected
                              </>
                            ) : 'Select'}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${p.name}? This cannot be undone.`)) {
                                setPlants((s) => s.filter((x) => x.id !== p.id));
                                if (selectedPlantId === p.id) setSelectedPlantId("");
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete plant"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {p.records && p.records.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Growth History
                          </h4>
                          <div className="space-y-3">
                            {p.records.slice(0, 3).map((r, idx) => (
                              <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{r.heightCm} cm</div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {new Date(r.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 text-right">
                                    <div>Scale: {r.scaleCmPerPixel.toFixed(4)} cm/px</div>
                                    <div className="mt-0.5">Pixels: {r.pixels}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {p.records.length > 3 && (
                              <div className="text-center">
                                <button className="text-xs text-green-600 hover:text-green-800 font-medium">
                                  + {p.records.length - 3} more measurements
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
          
          {/* Plant Animation Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Your Plant's Progress
                </h3>
                <div className="flex justify-center">
                  <PlantAnimation progress={plantGrowthProgress} height={250} width={200} />
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Growth Milestones</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${plantGrowthProgress > 0 ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                      Reference points marked
                    </li>
                    <li className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${plantGrowthProgress > 0.3 ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                      Plant base measured
                    </li>
                    <li className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${plantGrowthProgress > 0.6 ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                      Plant tip measured
                    </li>
                    <li className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${plantGrowthProgress > 0.9 ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                      Growth recorded!
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Better Growth</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Measure at the same time each day for consistent results
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Keep the camera at the same distance for each measurement
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Ensure good lighting for clearer photos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}