'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  Loader2,
  FileImage,
  HardDrive
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

export default function ImageUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage('Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)');
        setMessageType('error');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        setMessageType('error');
        return;
      }
      
      setSelectedFile(file);
      setMessage('');
      setMessageType('');
    }
  };
  // Upload image with progress simulation
  const uploadImage = async () => {
    if (!selectedFile) {
      setMessage('Please select an image file');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');
    setMessageType('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();      if (result.success) {
        setMessage('Image uploaded successfully!');
        setMessageType('success');
        setSelectedFile(null);
        setUploadProgress(0);
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
      } else {
        setMessage(`Upload failed: ${result.message}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Upload error: ${error.message}`);
      setMessageType('error');    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Image Upload to AWS S3</h1>
          <p className="text-lg text-gray-600">Upload and manage your images through Ballerina backend</p>
        </div>        <div className="max-w-2xl mx-auto">
          {/* Upload Section */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Select an image file to upload to your S3 storage
              </CardDescription>
            </CardHeader><CardContent className="space-y-6">
              {/* File Input */}
              <div className="space-y-2">
                <Label htmlFor="fileInput" className="flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Select Image
                </Label>
                <Input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full"
                />
              </div>

              {/* File Info */}
              {selectedFile && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="w-8 h-8 text-blue-500 mt-1" />
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {formatFileSize(selectedFile.size)}
                          </span>
                          <Badge variant="secondary">{selectedFile.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Progress */}
              {uploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Upload Button */}              <Button
                onClick={uploadImage}
                disabled={uploading || !selectedFile}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>

              {/* Message */}
              {message && (
                <Alert className={messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  {messageType === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}