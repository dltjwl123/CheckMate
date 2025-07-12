import Link from "next/link";
import { useState } from "react";
import Modal from "./ui/modal";
import TermsContent from "./terms";
import PrivacyContent from "./privacy";

function Footer() {
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">저작권 항목</div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowTermsModal(true)}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                이용약관
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                개인정보처리방침
              </button>

              <Link
                href="https://github.com/dltjwl123/CheckMate"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={showTermsModal}
        title="이용약관"
        onClose={() => setShowTermsModal(false)}
      >
        <TermsContent />
      </Modal>

      <Modal
        isOpen={showPrivacyModal}
        title="개인정보처리방침"
        onClose={() => setShowPrivacyModal(false)}
      >
        <PrivacyContent />
      </Modal>
    </>
  );
}

export default Footer;
