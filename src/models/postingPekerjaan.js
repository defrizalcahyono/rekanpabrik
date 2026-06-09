const conn = require("../config/db_connection");

const getAllPost = () => {
  const SQLQuery = `
    SELECT
      pp.id_post_pekerjaan,
      pp.id_perusahaan,
      pp.posisi,
      pp.lokasi,
      pp.job_details,
      pp.requirements,
      pp.status,
      pp.createdAt,

      p.nama_perusahaan,
      p.profile_pict

    FROM posting_pekerjaan pp

    INNER JOIN perusahaan p
      ON pp.id_perusahaan = p.id_perusahaan

    ORDER BY pp.createdAt DESC
  `;

  return conn.execute(SQLQuery);
};

const countPostingan = () => {
  const SQLQuery = `
    SELECT COUNT(*) AS total
    FROM posting_pekerjaan
  `;

  return conn.execute(SQLQuery);
};

const getAllPostAktif = () => {
  const SQLQuery = `
    SELECT
      pp.id_post_pekerjaan,
      pp.id_perusahaan,
      pp.posisi,
      pp.lokasi,
      pp.job_details,
      pp.requirements,
      pp.status,
      pp.createdAt,

      p.nama_perusahaan,
      p.profile_pict

    FROM posting_pekerjaan pp

    INNER JOIN perusahaan p
      ON pp.id_perusahaan = p.id_perusahaan

    WHERE pp.status = 'aktif'

    ORDER BY pp.createdAt DESC
  `;

  return conn.execute(SQLQuery);
};

const getPostByIDPostingan = (
  idPostingan
) => {
  const SQLQuery = `
    SELECT
      pp.id_post_pekerjaan,
      pp.id_perusahaan,
      pp.posisi,
      pp.lokasi,
      pp.job_details,
      pp.requirements,
      pp.status,
      pp.createdAt,

      p.nama_perusahaan,
      p.about_me,
      p.profile_pict,
      p.alamat

    FROM posting_pekerjaan pp

    INNER JOIN perusahaan p
      ON pp.id_perusahaan = p.id_perusahaan

    WHERE pp.id_post_pekerjaan = ?

    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idPostingan,
  ]);
};

const getAllPostByIDPerusahaan = (
  idPerusahaan
) => {
  const SQLQuery = `
    SELECT
      pp.id_post_pekerjaan,
      pp.id_perusahaan,
      pp.posisi,
      pp.lokasi,
      pp.job_details,
      pp.requirements,
      pp.status,
      pp.createdAt,

      p.nama_perusahaan,
      p.about_me,
      p.profile_pict,
      p.alamat

    FROM posting_pekerjaan pp

    INNER JOIN perusahaan p
      ON pp.id_perusahaan = p.id_perusahaan

    WHERE pp.id_perusahaan = ?

    ORDER BY pp.createdAt DESC
  `;

  return conn.execute(
    SQLQuery,
    [idPerusahaan]
  );
};

const addPostPekerjaan = (
  idPerusahaan,
  posisi,
  lokasi,
  jobDetails,
  requirements,
  status,
  createdAt
) => {
  const SQLQuery = `
    INSERT INTO posting_pekerjaan
    (
      id_perusahaan,
      posisi,
      lokasi,
      job_details,
      requirements,
      status,
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return conn.execute(SQLQuery, [
    idPerusahaan,
    posisi,
    lokasi,
    jobDetails,
    requirements,
    status,
    createdAt,
  ]);
};

const editStatusPostingan = (
  idPostingan,
  status
) => {
  const SQLQuery = `
    UPDATE posting_pekerjaan
    SET status = ?
    WHERE id_post_pekerjaan = ?
  `;

  return conn.execute(SQLQuery, [
    status,
    idPostingan,
  ]);
};

const deletePostingan = (
  idPostingan
) => {
  const SQLQuery = `
    DELETE FROM posting_pekerjaan
    WHERE id_post_pekerjaan = ?
  `;

  return conn.execute(SQLQuery, [
    idPostingan,
  ]);
};

const getDetailPelamar = (
  idLamaranPekerjaan
) => {
  const SQLQuery = `
    SELECT
      pel.id_pelamar,
      pel.first_name,
      pel.last_name,
      pel.profile_pict,
      pel.curriculum_vitae,

      mp.id_lamaran_pekerjaan,
      mp.status,

      pp.posisi

    FROM melamar_pekerjaan mp

    INNER JOIN pelamar pel
      ON mp.id_pelamar = pel.id_pelamar

    INNER JOIN posting_pekerjaan pp
      ON mp.id_post_pekerjaan =
         pp.id_post_pekerjaan

    WHERE mp.id_lamaran_pekerjaan = ?

    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idLamaranPekerjaan,
  ]);
};

module.exports = {
  getAllPost,
  getAllPostAktif,
  countPostingan,

  getPostByIDPostingan,
  getAllPostByIDPerusahaan,

  addPostPekerjaan,

  editStatusPostingan,
  deletePostingan,

  getDetailPelamar,
};