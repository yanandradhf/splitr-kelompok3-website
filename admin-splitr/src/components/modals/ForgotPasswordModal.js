import Modal from './Modal';
import Button from '../ui/Button';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const handleEmailIT = () => {
    window.open('mailto:it-support@bni.co.id?subject=Password Reset Request - Admin Splitr', '_blank');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Password Reset Request
        </h3>
        
        {/* Message */}
        <div className="text-gray-600 mb-6 leading-relaxed">
          <p className="mb-3">
            Untuk keamanan sistem dan data perusahaan, reset password hanya dapat dilakukan melalui tim IT internal.
          </p>
          <div className="text-sm bg-gray-50 p-3 rounded-lg border-l-4 border-orange-500">
            <strong>Silahkan hubungi:</strong><br/>
            📧 it-support@bni.co.id<br/>
            📞 Ext. 2024 (Internal)<br/>
            🕒 Senin - Jumat, 08:00 - 17:00 WIB
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Tutup
          </Button>
          <Button onClick={handleEmailIT} className="flex-1">
            Kirim Email
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;