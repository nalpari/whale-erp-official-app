"use client";
import "@/styles/publishpage.scss";

export default function StyleFiled() {
  return (
    <div className="style-guide-wrap">
      <div className="style-guide-item mb20 shadow04 radius-12">
        <div className="tit ds-h4">Input, Select, Datepicker</div>
        <div className="guide-item-content">
          <div className="block mb10">
            <select name="" id="" className="select-form">
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div className="block mb10">
            <input
              type="text"
              className="input-frame"
              defaultValue="Default Value"
            />
          </div>
          <div className="block mb10">
            <div className="input-icon-frame">
              <input type="text" defaultValue="Default Value" />
              <button type="button" className="input-icon-btn del"></button>
            </div>
          </div>
          <div className="block mb10">
            <div className="input-icon-frame">
              <input type="text" defaultValue="Default Value" />
              <button
                type="button"
                className="input-icon-btn search-del"
              ></button>
              <button type="button" className="input-icon-btn search"></button>
            </div>
          </div>
          <div className="block mb10">
            <div className="date-picker-custom">
              <input
                type="text"
                className="date-picker-input"
                defaultValue="Default Value"
              />
            </div>
          </div>
          <div className="block mb10">
            <select name="" id="" className="select-form" disabled>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div className="block mb10">
            <input
              type="text"
              className="input-frame"
              readOnly
              defaultValue="Default Value"
            />
          </div>
          <div className="block mb10">
            <div className="input-icon-frame">
              <input type="text" readOnly defaultValue="Default Value" />
              <button type="button" className="input-icon-btn del"></button>
            </div>
          </div>
          <div className="block">
            <div className="date-picker-custom">
              <input
                type="text"
                className="date-picker-input"
                readOnly
                defaultValue="Default Value"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="style-guide-item mb20 shadow04 radius-12">
        <div className="tit ds-h4">Checkbox</div>
        <div className="guide-item-content">
          <div className="check-form-box mb10">
            <input type="checkbox" id="checkbox1" />
            <label htmlFor="checkbox1">Checkbox 1</label>
          </div>
          <div className="check-form-box">
            <input type="checkbox" id="checkbox2" />
            <label htmlFor="checkbox2">Checkbox 2</label>
          </div>
        </div>
      </div>
      <div className="style-guide-item mb20 shadow04 radius-12">
        <div className="tit ds-h4">Button</div>
        <div className="guide-item-content">
          <div className="block mb10">
            <button className="btn-form black block">Button</button>
          </div>
          <div className="block mb10">
            <button className="btn-form blue block">Button</button>
          </div>
          <div className="block mb10">
            <button className="btn-form sky block">Button</button>
          </div>
          <div className="block mb15">
            <button className="btn-form black block" disabled>
              Button
            </button>
          </div>
          <div className="block ds-h6 mb10">Min Button</div>
          <div className="block mb10">
            <button className="btn-form outline min block">Button</button>
          </div>
          <div className="block">
            <button className="btn-form black min block">Button</button>
          </div>
        </div>
      </div>
      <div className="style-guide-item mb20 shadow04 radius-12">
        <div className="tit ds-h4">Radio Button</div>
        <div className="guide-item-content">
          <div className="flex g8">
            <button className="radio-btn block act">Button</button>
            <button className="radio-btn block">Button</button>
            <button className="radio-btn block">Button</button>
          </div>
        </div>
      </div>
      <div className="style-guide-item mb20 shadow04 radius-12">
        <div className="tit ds-h4">Button Small</div>
        <div className="guide-item-content">
          <div className="flex g8">
            <button className="btn-s black">등록</button>
            <button className="btn-s sky">등록</button>
            <button className="btn-s grey">등록</button>
          </div>
        </div>
      </div>
      <div className="style-guide-item mb20 shadow04 radius-12">
        <div className="tit ds-h4">Badge</div>
        <div className="guide-item-content">
          <div className="flex g8">
            <span className="badge red">미운영</span>
            <span className="badge blue">운영</span>
          </div>
        </div>
      </div>
    </div>
  );
}
