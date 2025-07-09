import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0">저작권 항목</div>
          <div className="flex items-center space-x-6">
						<Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
							이용약관
						</Link>
						<Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
							개인정보처리방침
						</Link>
						<Link href="https://github.com/dltjwl123/CheckMate" className="text-gray-600 hover:text-gray-900 text-sm">
							GitHub
						</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;