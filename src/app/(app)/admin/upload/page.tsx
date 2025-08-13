'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/upload/file-uploader';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Library, 
  Users, 
  FolderOpen,
  CheckCircle,
  Link,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UploadedFile {
  url: string;
  key: string;
  folder: string;
  timestamp: Date;
}

export default function AdminUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleUploadComplete = (folder: string) => (url: string, key: string) => {
    const newFile: UploadedFile = {
      url,
      key,
      folder,
      timestamp: new Date(),
    };
    
    setUploadedFiles(prev => [newFile, ...prev]);
    toast.success('File uploaded successfully!');
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            AWS S3 File Upload
          </h1>
          <p className="text-gray-400">
            Upload files to different S3 folders for courses, library, profiles, and resources
          </p>
        </div>

        {/* Upload Tabs */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600">
                <GraduationCap className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="library" className="data-[state=active]:bg-purple-600">
                <Library className="w-4 h-4 mr-2" />
                Library
              </TabsTrigger>
              <TabsTrigger value="profiles" className="data-[state=active]:bg-purple-600">
                <Users className="w-4 h-4 mr-2" />
                Profiles
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600">
                <FolderOpen className="w-4 h-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Upload Course Materials
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload videos, PDFs, and other course materials
                  </p>
                </div>
                <FileUploader
                  folder="courses"
                  accept="video/*,application/pdf"
                  onUploadComplete={handleUploadComplete('courses')}
                  onError={handleError}
                />
              </div>
            </TabsContent>

            <TabsContent value="library" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Upload Library Resources
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload articles, guides, and reference materials
                  </p>
                </div>
                <FileUploader
                  folder="library"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onUploadComplete={handleUploadComplete('library')}
                  onError={handleError}
                />
              </div>
            </TabsContent>

            <TabsContent value="profiles" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Upload Profile Images
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload profile pictures and avatars
                  </p>
                </div>
                <FileUploader
                  folder="profiles"
                  accept="image/*"
                  maxSize={10 * 1024 * 1024} // 10MB for images
                  onUploadComplete={handleUploadComplete('profiles')}
                  onError={handleError}
                />
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Upload General Resources
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload any other files and resources
                  </p>
                </div>
                <FileUploader
                  folder="resources"
                  onUploadComplete={handleUploadComplete('resources')}
                  onError={handleError}
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Recently Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="mt-8 bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Recently Uploaded Files
            </h2>
            
            <div className="space-y-3">
              {uploadedFiles.slice(0, 5).map((file, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.key.split('/').pop()}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-400">
                        Folder: {file.folder}
                      </span>
                      <span className="text-xs text-gray-400">
                        {file.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(file.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(file.key)}
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 bg-yellow-500/10 border-yellow-500/20 p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-3">
            📝 Upload Instructions
          </h3>
          <ul className="space-y-2 text-sm text-yellow-200">
            <li>• Maximum file size: 500MB (10MB for profile images)</li>
            <li>• Supported formats: Videos (MP4, WebM, OGG), Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX)</li>
            <li>• Files are automatically organized by upload date and given unique names</li>
            <li>• URLs are permanent and can be used in courses, profiles, and resources</li>
            <li>• Multiple files can be uploaded at once</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}