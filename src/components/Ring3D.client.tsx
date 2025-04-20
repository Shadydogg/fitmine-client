import dynamic from "next/dynamic";

const Ring3D = dynamic(() => import("./Ring3D"), {
  ssr: false,
  loading: () => (
    <div className="w-32 h-32 flex items-center justify-center text-sm text-gray-500">
      Loading 3D Ring...
    </div>
  ),
});

export default Ring3D;
