import StoreForm03 from "../storeform/StoreForm03";

export default function StoreEditPhoto() {
  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <StoreForm03 />
        </div>
      </div>
      <div className="content-pagination">
        <button className="btn-form block blue">저장</button>
      </div>
    </>
  );
}
