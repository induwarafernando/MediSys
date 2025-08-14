import React, { useState, useCallback } from 'react';
import { 
  Menu, 
  X, 
  Upload, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Home,
  Database,
  Bell,
  Shield,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Search
} from 'lucide-react';

function DashboardPage() {
  // Simulating role from props or state - in real app this would come from auth context
  const [currentRole, setCurrentRole] = useState('clinic_user'); // Can be 'clinic_user' or 'internal_staff'
  const role = currentRole;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Report_2024.csv processed successfully', type: 'success', time: '2 min ago' },
    { id: 2, message: 'New upload from Clinic A pending review', type: 'info', time: '5 min ago' }
  ]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  }, []);

  const handleFileDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Dashboard', href: '#', icon: Home },
    ];

    const roleSpecificLinks = {
      clinic_user: [
        { name: 'Upload Reports', href: '/upload', icon: Upload },
        { name: 'Report History', href: '/history', icon: FileText },
        { name: 'Notifications', href: '/notifications', icon: Bell },
      ],
      internal_staff: [
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'All Submissions', href: '/dashboard/reports', icon: Database },
        { name: 'Compliance', href: '/compliance', icon: Shield },
        { name: 'Trends', href: '/trends', icon: TrendingUp },
      ]
    };

    const commonLinks = [
      { name: 'Help', href: '#', icon: HelpCircle },
      { name: 'Settings', href: '#', icon: Settings },
    ];

    return [...baseLinks, ...(roleSpecificLinks[role] || []), ...commonLinks];
  };

  const mockReports = [
    { 
      id: 1,
      name: 'Blood_Test_Results_Jan2025.csv', 
      uploadDate: 'Aug 12, 2025', 
      status: 'Completed',
      clinic: 'Clinic A',
      recordCount: 150,
      processingTime: '2.3s'
    },
    { 
      id: 2,
      name: 'Radiology_Reports_Q1.xlsx', 
      uploadDate: 'Aug 13, 2025', 
      status: 'Processing',
      clinic: 'Clinic B',
      recordCount: 75,
      processingTime: '5.1s'
    },
    { 
      id: 3,
      name: 'Lab_Results_Feb2025.csv', 
      uploadDate: 'Aug 14, 2025', 
      status: 'Failed',
      clinic: 'Clinic A',
      recordCount: 0,
      processingTime: '0.8s'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = mockReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.clinic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Enhanced Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">MediSys</h2>
            </div>
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? <Menu className="h-5 w-5 text-gray-600" /> : <X className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
          {!isCollapsed && (
            <div className="mt-3 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              Role: {role.replace('_', ' ').toUpperCase()}
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {getNavLinks().map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group"
              >
                <IconComponent className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                <span className={`font-medium transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                  {link.name}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Notifications indicator */}
        {!isCollapsed && notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Recent Notifications</div>
            <div className="space-y-1">
              {notifications.slice(0, 2).map(notif => (
                <div key={notif.id} className="text-xs p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                  <div className="text-gray-700 font-medium">{notif.message}</div>
                  <div className="text-gray-500">{notif.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Enhanced Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {role === 'clinic_user' ? 'Clinic Dashboard' : 'Staff Analytics Dashboard'}
            </h1>
            <p className="text-gray-600">
              {role === 'clinic_user' 
                ? 'Upload and manage your diagnostic reports securely'
                : 'Monitor system performance and clinic submissions'}
            </p>
          </div>

          {role === 'clinic_user' && (
            <>
              {/* Enhanced Upload Section */}
              <section className="mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Upload Diagnostic Reports
                  </h2>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 bg-gray-50 p-8 rounded-xl text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag & drop CSV/Excel files or</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        multiple
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        Browse Files
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Selected Files:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button 
                              onClick={simulateUpload}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                              Upload
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uploadProgress !== null && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Enhanced History Section */}
              <section className="mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Upload History
                  </h3>
                  
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by file name or clinic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>All Status</option>
                      <option>Completed</option>
                      <option>Processing</option>
                      <option>Failed</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left px-6 py-3 font-semibold text-gray-700">File Details</th>
                          <th className="text-left px-6 py-3 font-semibold text-gray-700">Upload Info</th>
                          <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
                          <th className="text-left px-6 py-3 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map((report) => (
                          <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900">{report.name}</div>
                                <div className="text-xs text-gray-500">{report.recordCount} records</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-gray-700">{report.uploadDate}</div>
                                <div className="text-xs text-gray-500">Processed in {report.processingTime}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(report.status)}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                  {report.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded" title="View Details">
                                  <Eye className="h-4 w-4 text-gray-500" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                                  <Download className="h-4 w-4 text-gray-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </>
          )}

          {role === 'internal_staff' && (
            <>
              {/* Staff Analytics Dashboard */}
              <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Submissions</p>
                      <p className="text-3xl font-bold text-gray-900">1,234</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-green-600 mt-2">↗ 12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Processing Time</p>
                      <p className="text-3xl font-bold text-gray-900">2.4s</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600 mt-2">↗ 15% faster</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Clinics</p>
                      <p className="text-3xl font-bold text-gray-900">45</p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-blue-600 mt-2">3 new this week</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-3xl font-bold text-gray-900">98.7%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600 mt-2">↗ 0.3% improvement</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Recent Submissions
                  </h3>
                  <div className="space-y-3">
                    {mockReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{report.clinic}</div>
                          <div className="text-xs text-gray-500">{report.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <span className="text-xs text-gray-600">{report.uploadDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    System Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">AWS Lambda Functions</span>
                      <span className="text-green-600 font-medium">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">DynamoDB Status</span>
                      <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">S3 Storage</span>
                      <span className="text-green-600 font-medium">Available</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">SNS Notifications</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;