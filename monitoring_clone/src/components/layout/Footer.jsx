const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerInner">
        <ul className="guide">
          <li>
            <a href="" target="_blank" title="새창">
              <i>이용안내</i>
            </a>
          </li>
          <li>
            <a href="" target="_blank" title="새창" className="privacy">
              <i>개인정보처리방침</i>
            </a>
          </li>
          <li>
            <a href="" target="_blank" title="새창">
              <i>고정형·이동형 영상정보처리기기 운영·관리 방침</i>
            </a>
          </li>
          <li>
            <a href="" target="_blank" title="새창">
              <i>찾아오시는 길</i>
            </a>
          </li>
        </ul>
      </div>
      <div className="locate">
        <address className="address">
          <p className="address">
            <span>주소</span>
          </p>
        </address>
        <p>콜센터 042-120 (365일) (평일 08:00~21:00 / 토·공휴일 09:00~18:00)</p>
        <p className="capyright">
          COPYRIGHT © METROPOLITAN CITY. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
