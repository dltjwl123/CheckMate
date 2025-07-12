function PrivacyContent() {
  return (
    <div className="prose prose-sm max-w-none">
      <h4 className="font-semibold mb-2">1. 개인정보의 처리목적</h4>
      <p className="mb-4 text-gray-700">
        CheckMate는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
        개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
        변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등
        필요한 조치를 이행할 예정입니다.
      </p>

      <h4 className="font-semibold mb-2">2. 개인정보의 처리 및 보유기간</h4>
      <p className="mb-4 text-gray-700">
        ① CheckMate는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보
        보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를
        처리·보유합니다.
        <br />② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
        <br />- 회원가입 및 관리: 서비스 이용계약 또는 회원가입 해지시까지
        <br />- 재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산
        완료시까지
      </p>

      <h4 className="font-semibold mb-2">3. 처리하는 개인정보의 항목</h4>
      <p className="mb-4 text-gray-700">
        ① CheckMate는 다음의 개인정보 항목을 처리하고 있습니다:
        <br />- 필수항목: 이메일, 비밀번호
        <br />- 선택항목: 닉네임, 프로필 사진
        <br />② 인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로
        생성되어 수집될 수 있습니다:
        <br />- IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록
        등
      </p>

      <h4 className="font-semibold mb-2">4. 개인정보의 제3자 제공</h4>
      <p className="mb-4 text-gray-700">
        ① CheckMate는 정보주체의 개인정보를 개인정보의 처리목적에서 명시한 범위
        내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법
        제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
      </p>
    </div>
  );
}

export default PrivacyContent;
