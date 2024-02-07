"use client";

import Image from "next/image";
import Styles from "./page.module.css";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
//import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");

  useEffect(() => {
    const storage = getStorage(app);
    const upload = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          if (progress == 100) toast.success("Uploading successful");
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    };

    file && upload();
  }, [file]);

  if (status === "loading") {
    return <div className={Styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }

  const slugify = (str) => {
    const timestamp = new Date().getTime();
    const slug = str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "")
      .replace(/^-+|-+$/g, "");

    return `${timestamp}-${slug}`;
  };
  const handleSubmit = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        slug: slugify(title),
        catSlug: catSlug || "news",
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      router.push(`/posts/${data.slug}`);
    }
  };

  return (
    <div className={Styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={Styles.input}
        onChange={(e) => {
          setTitle(e.target.value);
          //e.preventDefault();
        }}
      />
      <select
        className={Styles.select}
        onChange={(e) => {
          setCatSlug(e.target.value);
          //e.preventDefault();
        }}
      >
        <option value="news">news</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
      <div className={Styles.editor}>
        <button className={Styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={Styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              style={{ display: "none" }}
            />
            <button className={Styles.addButton}>
              <label htmlFor="image">
                <Image src="/imgU.png" alt="" width={16} height={16} />
              </label>
            </button>
            <button className={Styles.addButton}>
              <Image src="/external.png" alt="" width={16} height={16} />
            </button>
            <button className={Styles.addButton}>
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}
        <ReactQuill
          className={Styles.textArea}
          theme="bubble"
          value={value}
          onChange={(content, delta, source, editor) => {
            setValue(content);
          }}
          placeholder="Tell your story..."
        />
      </div>
      <button className={Styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};

export default WritePage;
