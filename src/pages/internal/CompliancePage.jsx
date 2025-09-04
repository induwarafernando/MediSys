// src/pages/internal/CompliancePage.jsx
import React from "react";
import { Shield, Lock, FileText, Eye, Server, Activity } from "lucide-react";

function ComplianceCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-start gap-4 hover:shadow-md transition">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="h-8 w-8 text-green-600" />
          Compliance & Security
        </h1>
        <p className="text-gray-600 mt-2">
          MediSys ensures HIPAA-compliant handling of all medical records with
          fine-grained access policies, encryption, and full audit logging.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <ComplianceCard
          icon={Lock}
          title="Encryption at Rest & In Transit"
          description="All S3 and DynamoDB data is encrypted using AWS KMS (AES-256).
          TLS 1.2+ is enforced for secure transmission of sensitive medical files."
        />
        <ComplianceCard
          icon={FileText}
          title="HIPAA Compliance"
          description="The system enforces HIPAA safeguards with strict data access,
          minimal privileges, and secure data retention policies."
        />
        <ComplianceCard
          icon={Eye}
          title="Audit Logging"
          description="Every access, upload, and download is logged via AWS CloudTrail
          and CloudWatch for traceability and forensic analysis."
        />
        <ComplianceCard
          icon={Server}
          title="Fine-Grained Access Control"
          description="Clinic users can only access their own reports while internal staff
          have broader visibility. Access is controlled via IAM + Cognito groups."
        />
        <ComplianceCard
          icon={Activity}
          title="Monitoring & Alerts"
          description="Continuous monitoring with CloudWatch alarms and SNS notifications
          ensures immediate awareness of policy violations or unusual activity."
        />
      </div>
    </div>
  );
}
