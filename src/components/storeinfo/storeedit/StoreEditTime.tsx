import StoreForm04 from "../storeform/StoreForm04";

export default function StoreEditTime() {
  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <StoreForm04 />
        </div>
      </div>
      <div className="content-pagination">
        <button className="btn-form block blue">저장</button>
      </div>
    </>
  );
}
