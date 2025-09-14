import { useState, type ChangeEvent } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from "lucide-react";

const ChanBoardManager = () => {
  const [threadTitle, setThreadTitle] = useState("test");
  const [posts, setPosts] = useState([
    {
      id: 1,
      number: 1,
      name: "風吹けば名無し",
      date: "2025/09/13(土)",
      time: "22:40:28",
      millisec: ".64",
      userId: "BU3HR9zHy",
      content: "test",
      image: null as string | null,
    },
    {
      id: 2,
      number: 2,
      name: "風吹けば名無し",
      date: "2025/09/13(土)",
      time: "22:40:28",
      millisec: ".19",
      userId: "BU3HR9zHy",
      content: "test2",
      image: null as string | null,
    },
  ]);

  const [editingPost, setEditingPost] = useState<{
    id: number;
    number: number;
    name: string;
    date: string;
    time: string;
    millisec: string;
    userId: string;
    content: string;
    image: string | null;
  } | null>(null);
  const [newPost, setNewPost] = useState({
    name: "風吹けば名無し",
    content: "",
    image: null as string | null,
    imagePreview: null as string | null,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const generateRandomId = () => Math.random().toString(36).substring(2, 11);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds =
      "." + String(now.getMilliseconds()).padStart(2, "0").substring(0, 2);

    return {
      date: `${year}/${month}/${day}(${dayOfWeek})`,
      time: `${hours}:${minutes}:${seconds}`,
      millisec: milliseconds,
    };
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB制限
        alert("画像サイズは5MB以下にしてください");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setNewPost({
          ...newPost,
          image: result,
          imagePreview: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewPost({
      ...newPost,
      image: null,
      imagePreview: null,
    });
  };

  const addPost = () => {
    if (!newPost.content.trim()) return;

    const { date, time, millisec } = getCurrentDateTime();
    const nextNumber = Math.max(...posts.map((p) => p.number)) + 1;

    const post = {
      id: Date.now(),
      number: nextNumber,
      name: newPost.name,
      date,
      time,
      millisec,
      userId: generateRandomId(),
      content: newPost.content,
      image: newPost.image,
    };

    setPosts([...posts, post]);
    setNewPost({
      name: "風吹けば名無し",
      content: "",
      image: null,
      imagePreview: null,
    });
    setShowAddForm(false);
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const startEdit = (post: (typeof posts)[0]) => {
    setEditingPost({ ...post });
  };

  const saveEdit = () => {
    if (editingPost) {
      setPosts(
        posts.map((post) => (post.id === editingPost.id ? editingPost : post))
      );
    }
    setEditingPost(null);
  };

  const cancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div
      style={{
        backgroundColor: "#EFEFEF",
        minHeight: "100vh",
        fontFamily: '"MS PGothic", monospace',
        fontSize: "17px",
        padding: "20px",
      }}
    >
      {/* 管理パネル */}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      >
        <h2 style={{ margin: "0 0 15px 0", color: "#333" }}>管理パネル</h2>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            スレッドタイトル:
          </label>
          <input
            type="text"
            value={threadTitle}
            onChange={(e) => setThreadTitle(e.target.value)}
            style={{
              width: "300px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "3px",
            }}
          />
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "3px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Plus size={16} />
          新しい投稿を追加
        </button>

        {showAddForm && (
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "3px",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                名前:
              </label>
              <input
                type="text"
                value={newPost.name}
                onChange={(e) =>
                  setNewPost({ ...newPost, name: e.target.value })
                }
                style={{
                  width: "200px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                内容:
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                rows={3}
                style={{
                  width: "400px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                <ImageIcon
                  size={16}
                  style={{ display: "inline", marginRight: "5px" }}
                />
                画像:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  backgroundColor: "white",
                }}
              />
              {newPost.imagePreview && (
                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      marginBottom: "5px",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    プレビュー:
                  </div>
                  <img
                    src={newPost.imagePreview}
                    alt="プレビュー"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      display: "block",
                    }}
                  />
                  <button
                    onClick={removeImage}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    画像を削除
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={addPost}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                投稿
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 掲示板表示 */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <span
          style={{
            fontSize: "21px",
            fontWeight: "bold",
            color: "red",
          }}
        >
          {threadTitle}
        </span>
        <br />

        {posts.map((post) => (
          <div key={post.id} style={{ position: "relative" }}>
            <p style={{ display: "inline", margin: 0 }}>
              <br />
              {post.number} ：
              <span
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                {editingPost && editingPost.id === post.id ? (
                  <input
                    type="text"
                    value={editingPost.name}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, name: e.target.value })
                    }
                    style={{
                      border: "1px solid #ccc",
                      padding: "2px",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                  />
                ) : (
                  post.name
                )}
              </span>
              ：{post.date} {post.time}
              <span
                style={{
                  color: "slategray",
                  fontSize: "14px",
                }}
              >
                {post.millisec}
              </span>{" "}
              ID:{post.userId}
              {/* 管理ボタン */}
              <span style={{ marginLeft: "10px" }}>
                {editingPost && editingPost.id === post.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        padding: "2px 6px",
                        marginRight: "5px",
                        cursor: "pointer",
                        borderRadius: "2px",
                      }}
                    >
                      <Save size={12} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "2px 6px",
                        cursor: "pointer",
                        borderRadius: "2px",
                      }}
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(post)}
                      style={{
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        padding: "2px 6px",
                        marginRight: "5px",
                        cursor: "pointer",
                        borderRadius: "2px",
                      }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "2px 6px",
                        cursor: "pointer",
                        borderRadius: "2px",
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </span>
              <div style={{ paddingLeft: "40px" }}>
                {editingPost && editingPost.id === post.id ? (
                  <textarea
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content: e.target.value,
                      })
                    }
                    rows={3}
                    style={{
                      width: "400px",
                      border: "1px solid #ccc",
                      padding: "5px",
                      fontSize: "17px",
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <div>
                    <div style={{ marginBottom: post.image ? "10px" : "0" }}>
                      {post.content}
                    </div>
                    {post.image && (
                      <div style={{ marginTop: "10px" }}>
                        <img
                          src={post.image}
                          alt="投稿画像"
                          style={{
                            maxWidth: "300px",
                            maxHeight: "300px",
                            border: "1px solid #ccc",
                            borderRadius: "3px",
                            cursor: "pointer",
                            display: "block",
                          }}
                          onClick={() => {
                            // 画像をクリックで拡大表示
                            const newWindow = window.open("", "_blank");
                            if (newWindow) {
                              newWindow.document.write(`
                                <html>
                                  <head><title>画像拡大表示</title></head>
                                  <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; min-height:100vh;">
                                    <img src="${post.image}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                                  </body>
                                </html>
                              `);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChanBoardManager;
