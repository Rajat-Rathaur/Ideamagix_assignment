import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye, AlertCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'react-router-dom';
const PatientPrescription = () => {
  const { doctorId } = useParams();
  console.log('Patient ID:', doctorId);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPdf, setExpandedPdf] = useState(null); // Track which PDF is expanded
  const patientId = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/prescriptions/doctor/${doctorId}/patient/${patientId.id}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

      /*   if (!response.ok) {
          throw new Error('Failed to fetch prescriptions');
        }

        const data = await response.json();
        console.log('Fetched prescriptions:', data);
        setPrescriptions(data); */
        if (response.status === 404) {
          setError('No prescription Found. Consult Doctor to get prescription');
          setPrescriptions([]);  // Clear any previous prescription data
        } else if (!response.ok) {
          throw new Error('Failed to fetch prescriptions');
        } else {
          const data = await response.json();
          console.log('Fetched prescriptions:', data);
          setPrescriptions(data);
          setError(null); 
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId.id]);

  const togglePdfView = (prescriptionId) => {
    setExpandedPdf(expandedPdf === prescriptionId ? null : prescriptionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-2 text-lg text-gray-600">
          <Loader className="w-6 h-6 animate-spin" />
          Loading prescriptions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center gap-2 text-lg text-red-600">
          <AlertCircle className="w-6 h-6" />
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Your Prescriptions
        </h1>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600">
                No prescriptions found. Please consult a doctor to get prescriptions.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div 
                key={prescription._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Prescription Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Prescription Details
                    </h2>
                    <span className="text-sm text-gray-500">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Prescription Content */}
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Medicines</h3>
                    <p className="text-gray-600">{prescription.medicines}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Care Instructions</h3>
                    <p className="text-gray-600">{prescription.careInstructions}</p>
                  </div>

                  {/* Check if pdfPath is available and valid */}
                  {prescription.pdfPath && prescription.pdfPath !== "/uploads/undefined" && (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => togglePdfView(prescription._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          {expandedPdf === prescription._id ? 'Hide PDF' : 'View PDF'}
                          {expandedPdf === prescription._id ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </button>
                        <a
                          href={`http://localhost:5000${prescription.pdfPath}`}
                          download={`prescription-${prescription._id}.pdf`}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </a>
                      </div>

                      {/* PDF Viewer */}
                      {expandedPdf === prescription._id && (
                        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                          <iframe
                            src={`http://localhost:5000${prescription.pdfPath}`}
                            title={`Prescription ${prescription._id}`}
                            className="w-full h-[600px]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescription;
