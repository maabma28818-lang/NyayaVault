import React from 'react';
import { 
  Lock, 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  Database, 
  Building2, 
  UserCheck, 
  Fingerprint, 
  Check 
} from 'lucide-react';


export interface CustodyEvent {
  id: string;
  stepNumber: number;
  title: string;
  actor: string;
  transferFlow?: string;
  timestamp: string;
  status: 'Validated' | 'Active' | 'Pending';
  isCurrentActive?: boolean;
  blockchainTx?: string;
  description: string;
  location?: string;
}

export interface CustodyTimelineProps {
  evidenceId?: string;
  caseId?: string;
  events?: CustodyEvent[];
  className?: string;
}

const defaultCustodyEvents: CustodyEvent[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Created & Sealed',
    actor: 'Investigating Officer (Sr. Inspector Rajesh Kadam)',
    timestamp: '12 Sept 2026, 10:32 AM',
    status: 'Validated',
    blockchainTx: 'TX-982370',
    description: 'Cryptographic envelope sealed with SHA-256 digest & tamper-evident HSM token signature.',
    location: 'Cyber Crime Branch, Mumbai'
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Transferred',
    actor: 'Transit Custody Officer',
    transferFlow: 'Investigating Unit → Forensic Lab',
    timestamp: '12 Sept 2026, 14:00 PM',
    status: 'Validated',
    blockchainTx: 'TX-982372',
    description: 'Secure physical & digital transit initiated with dual-factor hardware token validation.',
    location: 'Transit Division'
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Accepted',
    actor: 'Forensic Lab (Chief Examiner Dr. V. Sen)',
    timestamp: '13 Sept 2026, 09:15 AM',
    status: 'Validated',
    blockchainTx: 'TX-982374',
    description: 'Physical & digital parity check validated. Memory dump analysis completed and indexed.',
    location: 'Central Forensic Science Laboratory'
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Transferred (Pending Acceptance)',
    actor: 'Forensic Lab → Public Prosecutor Office',
    transferFlow: 'Forensic Lab → Prosecutor',
    timestamp: 'Pending Handshake',
    status: 'Active',
    isCurrentActive: true,
    description: 'Evidence transfer dispatch initiated. Awaiting Public Prosecutor cryptographic acceptance key.',
    location: 'High Court Legal Vault'
  }
];

export const CustodyTimeline: React.FC<CustodyTimelineProps> = ({
  evidenceId = 'NV-EV-2026-000184',
  caseId = 'MH-MUM-2026-00421',
  events = defaultCustodyEvents,
  className = ''
}) => {
  return (
    <div 
      className={`custody-timeline-container ${className}`}
      style={{
        background: 'linear-gradient(145deg, #0e1320 0%, #080b14 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.08)',
        color: '#e2e8f0',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            padding: '0.6rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.35)'
          }}>
            <Fingerprint size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Chain of Custody Timeline
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Immutable Zero-Trust Ledger Audit Trail
            </span>
          </div>
        </div>

        {/* Evidence Identification Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            color: '#60a5fa',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: 'monospace'
          }}>
            EVIDENCE: {evidenceId}
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            CASE: {caseId}
          </div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div style={{ position: 'relative', paddingLeft: '0.5rem' }}>

        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const isValidated = event.status === 'Validated';
          const isActive = event.isCurrentActive || event.status === 'Active';

          return (
            <div 
              key={event.id}
              style={{
                position: 'relative',
                display: 'flex',
                gap: '1.5rem',
                paddingBottom: isLast ? '0.5rem' : '2.25rem'
              }}
            >
              {/* Connecting Vertical Line */}
              {!isLast && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '36px',
                    left: '19px',
                    width: '2px',
                    height: 'calc(100% - 20px)',
                    background: isValidated 
                      ? 'linear-gradient(180deg, #10b981 0%, rgba(59, 130, 246, 0.4) 100%)' 
                      : 'rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                />
              )}

              {/* Step Node Icon / Indicator */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                {isValidated ? (
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: '2px solid #34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.45)'
                    }}
                  >
                    {event.stepNumber === 1 && <Lock size={18} color="#ffffff" />}
                    {event.stepNumber === 2 && <ArrowRightLeft size={18} color="#ffffff" />}
                    {event.stepNumber === 3 && <CheckCircle2 size={18} color="#ffffff" />}
                  </div>
                ) : (
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      border: '2px solid #3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 18px rgba(59, 130, 246, 0.55)',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <Clock size={18} color="#60a5fa" />
                  </div>
                )}
                <style>
                  {`@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }`}
                </style>
              </div>

              {/* Event Content Card */}
              <div 
                style={{
                  flex: 1,
                  background: isActive 
                    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' 
                    : 'rgba(15, 23, 42, 0.5)',
                  border: isActive 
                    ? '1px solid rgba(59, 130, 246, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: isActive ? '0 4px 20px rgba(59, 130, 246, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Step Header Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '0.65rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isValidated ? '#34d399' : '#60a5fa',
                        background: isValidated ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.15)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        Step {event.stepNumber}
                      </span>

                      <h4 style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0
                      }}>
                        {event.title}
                      </h4>

                      {/* Status Badges */}
                      {isValidated && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          color: '#34d399',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px'
                        }}>
                          <Check size={12} /> Validated
                        </span>
                      )}

                      {isActive && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          color: '#60a5fa',
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          padding: '0.15rem 0.55rem',
                          borderRadius: '9999px',
                          animation: 'pulse 2s infinite'
                        }}>
                          <Clock size={12} /> Current Active Step
                        </span>
                      )}
                    </div>

                    {/* Transfer Flow or Actor details */}
                    {event.transferFlow && (
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#93c5fd',
                        marginTop: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <ArrowRightLeft size={14} color="#60a5fa" />
                        {event.transferFlow}
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Blockchain TX Logged Badge */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.35rem'
                  }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: isActive ? '#fbbf24' : '#cbd5e1'
                    }}>
                      {event.timestamp}
                    </div>

                    {/* Small "Blockchain TX Logged" badge next to timestamp for completed steps */}
                    {event.blockchainTx && (
                      <div 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          color: '#34d399',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          fontFamily: 'monospace'
                        }}
                        title={`Hyperledger Fabric Transaction: ${event.blockchainTx}`}
                      >
                        <Database size={11} color="#10b981" />
                        <span>Blockchain TX Logged</span>
                        <span style={{ color: '#a7f3d0', opacity: 0.85 }}>({event.blockchainTx})</span>
                      </div>
                    )}

                    {isActive && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        <Clock size={11} /> Awaiting Confirmation
                      </div>
                    )}
                  </div>
                </div>

                {/* Actor & Entity Info */}
                <div style={{
                  fontSize: '0.825rem',
                  color: '#94a3b8',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <UserCheck size={15} color="#60a5fa" />
                  <span>Custodian / Agent: <strong style={{ color: '#e2e8f0' }}>{event.actor}</strong></span>
                </div>

                {/* Detailed Description */}
                <p style={{
                  fontSize: '0.825rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {event.description}
                </p>

                {/* Location Footer */}
                {event.location && (
                  <div style={{
                    marginTop: '0.65rem',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Building2 size={13} />
                    <span>Location: {event.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default CustodyTimeline;
