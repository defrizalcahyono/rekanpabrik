const conn = require("../config/db_connection");

const simpanPekerjaan = (idPelamar, idPostPekerjaan) => {
  const SQLQuery = `
    INSERT INTO saved_jobs
    (id_pelamar, id_post_pekerjaan)
    VALUES (?, ?)
  `;

  return conn.execute(SQLQuery, [
    idPelamar,
    idPostPekerjaan,
  ]);
};

const isJobSaved = (idPelamar, idPostPekerjaan) => {
  const SQLQuery = `
    SELECT id_saved_jobs
    FROM saved_jobs
    WHERE id_pelamar = ?
      AND id_post_pekerjaan = ?
    LIMIT 1
  `;

  return conn.execute(SQLQuery, [
    idPelamar,
    idPostPekerjaan,
  ]);
};

const getSavedJobsByIdPelamar = (idPelamar) => {
  const SQLQuery = `
    SELECT
      sj.id_saved_jobs,
      sj.id_pelamar,
      sj.id_post_pekerjaan,

      pp.posisi,
      pp.lokasi,
      pp.job_details,
      pp.requirements,
      pp.status,
      pp.createdAt,

      p.id_perusahaan,
      p.nama_perusahaan,
      p.profile_pict

    FROM saved_jobs sj
    INNER JOIN posting_pekerjaan pp
      ON sj.id_post_pekerjaan = pp.id_post_pekerjaan
    INNER JOIN perusahaan p
      ON pp.id_perusahaan = p.id_perusahaan
    WHERE sj.id_pelamar = ?
    ORDER BY sj.id_saved_jobs DESC
  `;

  return conn.execute(SQLQuery, [idPelamar]);
};

const countSavedJobs = (idPelamar) => {
  const SQLQuery = `
    SELECT COUNT(*) AS total
    FROM saved_jobs
    WHERE id_pelamar = ?
  `;

  return conn.execute(SQLQuery, [idPelamar]);
};

const deleteSavedJobsById = (idSavedJobs) => {
  const SQLQuery = `
    DELETE FROM saved_jobs
    WHERE id_saved_jobs = ?
  `;

  return conn.execute(SQLQuery, [idSavedJobs]);
};

const deleteSavedJobByPelamarAndPost = (
  idPelamar,
  idPostPekerjaan
) => {
  const SQLQuery = `
    DELETE FROM saved_jobs
    WHERE id_pelamar = ?
      AND id_post_pekerjaan = ?
  `;

  return conn.execute(SQLQuery, [
    idPelamar,
    idPostPekerjaan,
  ]);
};

module.exports = {
  simpanPekerjaan,
  isJobSaved,
  getSavedJobsByIdPelamar,
  countSavedJobs,
  deleteSavedJobsById,
  deleteSavedJobByPelamarAndPost,
};