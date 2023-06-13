import { Routes, Route } from "react-router-dom";

import {
  PrivateEditor,
  PublicEditor,
  ReadPublished,
  UserDashboard,
  Home,
  PublishedItem,
  EditProfile,
  AdminDashboard,
  CategoryPage,
  CreatorPage,
  Page404,
} from "./Pages";
import { Navbar, Footer, Connect } from "./components";

const App = () => {
  return (
    <div className="min-h-screen ">
      <div className="bg-field-bg">
        <Navbar />
        <Routes>
          <Route path="/connect" element={<Connect />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/private-pager" element={<PrivateEditor />} />
          <Route
            path="/read-published/:id/:title/:creator"
            element={<ReadPublished />}
          />
          <Route path="/publish-pager" element={<PublicEditor />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/category/:label/pagers" element={<CategoryPage />} />
          <Route
            path="/published-item/:id/:title/:category"
            element={<PublishedItem />}
          />
          <Route path="/creator" element={<CreatorPage />} />
          <Route
            path="/creator/:id/:creatorAddress/:creator"
            element={<CreatorPage />}
          />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/*" element={<Page404 />} />
        </Routes>

        <Footer />
      </div>
    </div>
  );
};

export default App;
