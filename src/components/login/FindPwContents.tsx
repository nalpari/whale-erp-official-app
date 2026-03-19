
export default function FindIdContents() {

  return (
    <div className="find-contents-wrap">
      <div className="find-header">
        <div className="find-header-tit">비밀번호 찿기</div>
        <div className="find-header-desc">회원정보에 등록된 이메일로 비밀번호를 찾을 수 있습니다.</div>
      </div>
      <div className="find-form">
        <div className="block mb8">
          <input type="text" className="input-frame" placeholder="Name" />
        </div>
        <div className="block mb8">
          <input type="text" className="input-frame" placeholder="Name" />
        </div>
        <div className="block">
          <input type="email" className="input-frame" placeholder="Email" />
        </div>
      </div>
      <div className="flex g8">
        <button className="btn-form l-grey block">취소</button>
        <button className="btn-form login block">비밀번호 찿기</button>
      </div>
    </div>
  )
}