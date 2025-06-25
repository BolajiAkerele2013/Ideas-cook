import React, { useState } from 'react';
import { 
  Book, 
  Users, 
  Shield, 
  DollarSign, 
  FileText, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Search,
  HelpCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I delete my profile?",
    answer: "You can delete your profile from the Profile page by clicking the 'Delete Profile' button. However, you cannot delete your profile if you hold equity in any idea or have the owner role. You must first reassign your equity or ownership before deletion is allowed.",
    category: "Profile Management"
  },
  {
    question: "What happens if I try to delete my profile while holding equity?",
    answer: "The system will block the deletion and display an error message listing all affected idea names. You'll be notified that you must reassign your equity or ownership before deletion is allowed.",
    category: "Profile Management"
  },
  {
    question: "Who can remove team members from an idea?",
    answer: "Users with either 'equity_owner' or 'owner' role can remove users assigned as 'viewer' or 'contractor'. This is done by clicking the small 'x' icon above the user's role display, followed by a confirmation dialog.",
    category: "Team Management"
  },
  {
    question: "What is an NDA and when do I need to accept it?",
    answer: "An NDA (Non-Disclosure Agreement) is a legal document that contractors must accept before accessing idea details. When a user with the contractor role tries to access an idea, they must accept and confirm the NDA agreement first.",
    category: "Legal & Security"
  },
  {
    question: "Can idea owners customize the NDA?",
    answer: "Yes, idea owners can customize the NDA through the 'NDA' tab on each idea's page. They can edit, update, and save the NDA content from this section.",
    category: "Legal & Security"
  },
  {
    question: "Who can add a debt financier to an idea?",
    answer: "Only users with the 'owner' role can add a debt_financier to an idea. This requires specifying the date of debt, amount, mode of repayment, and date of full repayment.",
    category: "Financial Management"
  },
  {
    question: "What happens when a debt financier is added?",
    answer: "The debt is automatically recorded in the Finance tab as an income transaction with the narration format: 'Debt added by [First Name] [Surname] of debt financier' and displayed in green to indicate income.",
    category: "Financial Management"
  },
  {
    question: "Who can add transactions to the Finance tab?",
    answer: "Only users with 'equity_owner' and 'owner' roles can add transactions. They can add both income and expense transactions with required details like date, amount, narration, and type.",
    category: "Financial Management"
  },
  {
    question: "What file types can I upload as transaction attachments?",
    answer: "You can upload JPG, JPEG, and PDF files as transaction attachments. The maximum file size allowed is 2MB per file.",
    category: "File Management"
  },
  {
    question: "What's the difference between one-time and recurring expenses?",
    answer: "One-time expenses are single transactions, while recurring expenses happen regularly (monthly, quarterly, etc.). When adding an expense, you can specify whether it's recurring to help with financial planning and tracking.",
    category: "Financial Management"
  }
];

export function UserGuide() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sections = [
    { id: 'overview', title: 'Overview', icon: Book },
    { id: 'profile', title: 'Profile Management', icon: Users },
    { id: 'security', title: 'Security & NDAs', icon: Shield },
    { id: 'finance', title: 'Financial Management', icon: DollarSign },
    { id: 'documents', title: 'Document Management', icon: FileText },
    { id: 'communication', title: 'Communication', icon: MessageSquare },
    { id: 'faq', title: 'FAQ', icon: HelpCircle }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Welcome to Bezael.com, a comprehensive platform for idea management, collaboration, and business development. 
                This guide will help you understand all the features and how to use them effectively.
              </p>
              
              <h3>Key Features</h3>
              <ul>
                <li><strong>Idea Management:</strong> Create, edit, and manage your business ideas</li>
                <li><strong>Team Collaboration:</strong> Invite team members with different roles and permissions</li>
                <li><strong>Financial Tracking:</strong> Monitor income, expenses, and debt financing</li>
                <li><strong>Document Management:</strong> Store and organize important documents</li>
                <li><strong>Communication:</strong> Built-in messaging and forum discussions</li>
                <li><strong>Security:</strong> NDA management and role-based access control</li>
              </ul>

              <h3>User Roles</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li><strong>Owner:</strong> Full control over the idea, can manage all aspects</li>
                  <li><strong>Equity Owner:</strong> Has equity stake, can manage finances and team</li>
                  <li><strong>Debt Financier:</strong> Provides debt financing to the idea</li>
                  <li><strong>Contractor:</strong> Works on specific tasks, requires NDA acceptance</li>
                  <li><strong>Viewer:</strong> Can view idea details but has limited editing rights</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important: Profile Deletion</h3>
              <p className="text-yellow-700">
                You cannot delete your profile if you hold equity in any idea or have the owner role. 
                You must first reassign your equity or ownership before deletion is allowed.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Deletion Process</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Navigate to your Profile page</li>
                <li>Click the "Delete Profile" button</li>
                <li>The system will check for any blocking conditions</li>
                <li>If you have equity or ownership roles, you'll see a list of affected ideas</li>
                <li>Reassign your roles and equity to other team members</li>
                <li>Once clear, you can proceed with deletion</li>
              </ol>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Deletion Consequences</h4>
                <ul className="text-red-700 space-y-1">
                  <li>• Your profile and all personal data will be permanently deleted</li>
                  <li>• You will lose access to all ideas and conversations</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Security & NDAs</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Non-Disclosure Agreements (NDAs)</h3>
              <p className="text-gray-700">
                NDAs protect confidential information and are required for contractors accessing ideas.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">For Contractors</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• You must accept the NDA before accessing any idea details</li>
                  <li>• The NDA dialog appears automatically when you try to access an idea</li>
                  <li>• Read the agreement carefully before accepting</li>
                  <li>• Once accepted, you gain full access to the idea</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">For Idea Owners</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Customize your NDA through the "NDA" tab on your idea page</li>
                  <li>• Edit and update the NDA content as needed</li>
                  <li>• All contractors must accept the current version</li>
                  <li>• Track who has accepted your NDA</li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold">Team Member Management</h3>
              <p className="text-gray-700">
                Owners and equity owners can manage team members with specific permissions.
              </p>

              <div className="space-y-2">
                <h4 className="font-medium">Removing Team Members</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Navigate to the idea's team section</li>
                  <li>Find the member you want to remove (viewers or contractors only)</li>
                  <li>Click the small "x" icon above their role display</li>
                  <li>Confirm the removal in the dialog that appears</li>
                </ol>
              </div>
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Management</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adding Debt Financiers</h3>
              <p className="text-gray-700">
                Only idea owners can add debt financiers to provide funding for ideas.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Required Information</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Date of Debt</li>
                  <li>• Amount of Debt</li>
                  <li>• Mode of Repayment (lump sum, installments, etc.)</li>
                  <li>• Date of Full Repayment</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Automatic Transaction Recording</h4>
                <p className="text-green-700">
                  When a debt financier is added, the system automatically creates an income transaction 
                  with the narration: "Debt added by [First Name] [Surname] of debt financier"
                </p>
              </div>

              <h3 className="text-lg font-semibold">Transaction Management</h3>
              <p className="text-gray-700">
                Equity owners and owners can add and manage financial transactions.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Income Transactions</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Revenue from sales</li>
                    <li>• Investment funding</li>
                    <li>• Debt financing</li>
                    <li>• Grants and awards</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Expense Transactions</h4>
                  <ul className="text-red-700 space-y-1">
                    <li>• One-time expenses</li>
                    <li>• Recurring expenses</li>
                    <li>• Operational costs</li>
                    <li>• Equipment purchases</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-medium">Transaction Attachments</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="text-blue-700 space-y-1">
                  <li>• Supported formats: JPG, JPEG, PDF</li>
                  <li>• Maximum file size: 2MB</li>
                  <li>• Optional but recommended for record keeping</li>
                  <li>• Drag and drop or click to upload</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Organize and manage all documents related to your ideas with proper access control.
              </p>

              <h3 className="text-lg font-semibold">Document Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Regular Documents</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Accessible to all team members</li>
                    <li>• Business plans and presentations</li>
                    <li>• Marketing materials</li>
                    <li>• General documentation</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">NDA-Protected Documents</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Requires NDA acceptance to view</li>
                    <li>• Confidential business information</li>
                    <li>• Financial records</li>
                    <li>• Technical specifications</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold">Business Templates</h3>
              <p className="text-gray-700">
                Access pre-built templates to accelerate your business development.
              </p>

              <div className="space-y-2">
                <h4 className="font-medium">Available Categories</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
                  <li>• Finance templates</li>
                  <li>• Legal documents</li>
                  <li>• Marketing plans</li>
                  <li>• Project management</li>
                  <li>• Business planning</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Template Rating System</h4>
                <p className="text-green-700">
                  Rate templates you've used to help other users find the most valuable resources. 
                  Your ratings contribute to the overall template quality score.
                </p>
              </div>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Communication</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Direct Messaging</h3>
              <p className="text-gray-700">
                Communicate privately with team members and other users on the platform.
              </p>

              <div className="space-y-2">
                <h4 className="font-medium">Message Features</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Real-time messaging</li>
                  <li>• File attachments</li>
                  <li>• Message reactions with emojis</li>
                  <li>• Conversation settings (mute, archive, star)</li>
                  <li>• Message editing and deletion</li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold">Forum Discussions</h3>
              <p className="text-gray-700">
                Participate in public discussions and share knowledge with the community.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">Discussion Categories</h4>
                  <ul className="text-purple-700 space-y-1">
                    <li>• General discussions</li>
                    <li>• Seeking funding</li>
                    <li>• Looking for partners</li>
                    <li>• Selling ideas</li>
                    <li>• Investment opportunities</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-medium text-indigo-800 mb-2">Forum Features</h4>
                  <ul className="text-indigo-700 space-y-1">
                    <li>• Create discussion threads</li>
                    <li>• Comment and reply</li>
                    <li>• Like posts and comments</li>
                    <li>• View count tracking</li>
                    <li>• Category filtering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      <p className="text-sm text-blue-600 mt-1">{faq.category}</p>
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFAQ === index && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 mt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">No FAQs found matching your search.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Guide</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive guide to using all features of the Bezael.com platform
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{section.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}