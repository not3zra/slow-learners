import React, { useState, useEffect } from "react";

const UploadMaterial = () => {
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mocked data for frontend development
      const mockMaterials = [
        { id: '1', name: 'Sample Material 1', url: '#' },
        { id: '2', name: 'Sample Material 2', url: '#' }
      ];
      setMaterials(mockMaterials);
    } catch (error) {
      setError("Could not fetch materials. Please try again.");
      console.error("Error fetching materials", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Optional: Add file type and size validation
      const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'application/msword'
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload PDF or DOC files only");
        return;
      }

      if (selectedFile.size > maxSize) {
        setError("File must be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate file upload for frontend development
      console.log("Uploading file:", file);
      
      // Mock a successful upload
      const mockUploadedMaterial = {
        id: Date.now().toString(),
        name: file.name,
        url: '#'
      };
      
      setMaterials(prev => [...prev, mockUploadedMaterial]);
      setFile(null);
      
      // Reset file input
      if (document.getElementById('fileInput')) {
        document.getElementById('fileInput').value = '';
      }
    } catch (error) {
      setError("Could not upload file. Please try again.");
      console.error("Error uploading file", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate delete for frontend development
      setMaterials(prev => prev.filter(material => material.id !== id));
    } catch (error) {
      setError("Could not delete material. Please try again.");
      console.error("Error deleting material", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
          <span className="mr-2">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Upload Study Material</h2>
      
      <div className="flex items-center gap-2 mb-4">
        <input 
          id="fileInput"
          type="file" 
          onChange={handleFileChange} 
          className="flex-grow p-2 border rounded"
          disabled={isLoading}
        />
        <button 
          onClick={handleUpload} 
          disabled={!file || isLoading}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📤 Upload
        </button>
      </div>

      <h3 className="text-lg font-medium mb-3">Uploaded Materials</h3>
      
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : materials.length === 0 ? (
        <div className="text-center text-gray-500">No materials uploaded yet</div>
      ) : (
        <div className="space-y-2">
          {materials.map((material) => (
            <div 
              key={material.id} 
              className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">📄</span>
                <a 
                  href={material.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {material.name}
                </a>
              </div>
              <button 
                onClick={() => handleDelete(material.id)}
                disabled={isLoading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadMaterial;