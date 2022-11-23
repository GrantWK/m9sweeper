/*
 * m9sweeper dash
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

package io.m9sweeper.trawler.framework.client.model;

import java.util.Objects;
import java.util.Arrays;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import io.m9sweeper.trawler.framework.client.model.ScanImageIssue;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
/**
 * ImageTrawlerResultDto
 */

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaClientCodegen", date = "2022-09-28T11:46:20.946110-05:00[America/Chicago]")
public class ImageTrawlerResultDto {
  @SerializedName("summary")
  private String summary = null;

  @SerializedName("criticalIssues")
  private BigDecimal criticalIssues = null;

  @SerializedName("majorIssues")
  private BigDecimal majorIssues = null;

  @SerializedName("mediumIssues")
  private BigDecimal mediumIssues = null;

  @SerializedName("lowIssues")
  private BigDecimal lowIssues = null;

  @SerializedName("negligibleIssues")
  private BigDecimal negligibleIssues = null;

  @SerializedName("encounterError")
  private Boolean encounterError = null;

  @SerializedName("startedAt")
  private BigDecimal startedAt = null;

  @SerializedName("finishedAt")
  private BigDecimal finishedAt = null;

  @SerializedName("policyId")
  private BigDecimal policyId = null;

  @SerializedName("policyStatus")
  private Boolean policyStatus = null;

  @SerializedName("imageHash")
  private String imageHash = null;

  @SerializedName("issues")
  private List<ScanImageIssue> issues = new ArrayList<ScanImageIssue>();

  public ImageTrawlerResultDto summary(String summary) {
    this.summary = summary;
    return this;
  }

   /**
   * Get summary
   * @return summary
  **/
  @Schema(required = true, description = "")
  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public ImageTrawlerResultDto criticalIssues(BigDecimal criticalIssues) {
    this.criticalIssues = criticalIssues;
    return this;
  }

   /**
   * Get criticalIssues
   * @return criticalIssues
  **/
  @Schema(required = true, description = "")
  public BigDecimal getCriticalIssues() {
    return criticalIssues;
  }

  public void setCriticalIssues(BigDecimal criticalIssues) {
    this.criticalIssues = criticalIssues;
  }

  public ImageTrawlerResultDto majorIssues(BigDecimal majorIssues) {
    this.majorIssues = majorIssues;
    return this;
  }

   /**
   * Get majorIssues
   * @return majorIssues
  **/
  @Schema(required = true, description = "")
  public BigDecimal getMajorIssues() {
    return majorIssues;
  }

  public void setMajorIssues(BigDecimal majorIssues) {
    this.majorIssues = majorIssues;
  }

  public ImageTrawlerResultDto mediumIssues(BigDecimal mediumIssues) {
    this.mediumIssues = mediumIssues;
    return this;
  }

   /**
   * Get mediumIssues
   * @return mediumIssues
  **/
  @Schema(required = true, description = "")
  public BigDecimal getMediumIssues() {
    return mediumIssues;
  }

  public void setMediumIssues(BigDecimal mediumIssues) {
    this.mediumIssues = mediumIssues;
  }

  public ImageTrawlerResultDto lowIssues(BigDecimal lowIssues) {
    this.lowIssues = lowIssues;
    return this;
  }

   /**
   * Get lowIssues
   * @return lowIssues
  **/
  @Schema(required = true, description = "")
  public BigDecimal getLowIssues() {
    return lowIssues;
  }

  public void setLowIssues(BigDecimal lowIssues) {
    this.lowIssues = lowIssues;
  }

  public ImageTrawlerResultDto negligibleIssues(BigDecimal negligibleIssues) {
    this.negligibleIssues = negligibleIssues;
    return this;
  }

   /**
   * Get negligibleIssues
   * @return negligibleIssues
  **/
  @Schema(required = true, description = "")
  public BigDecimal getNegligibleIssues() {
    return negligibleIssues;
  }

  public void setNegligibleIssues(BigDecimal negligibleIssues) {
    this.negligibleIssues = negligibleIssues;
  }

  public ImageTrawlerResultDto encounterError(Boolean encounterError) {
    this.encounterError = encounterError;
    return this;
  }

   /**
   * Get encounterError
   * @return encounterError
  **/
  @Schema(required = true, description = "")
  public Boolean isEncounterError() {
    return encounterError;
  }

  public void setEncounterError(Boolean encounterError) {
    this.encounterError = encounterError;
  }

  public ImageTrawlerResultDto startedAt(BigDecimal startedAt) {
    this.startedAt = startedAt;
    return this;
  }

   /**
   * Get startedAt
   * @return startedAt
  **/
  @Schema(required = true, description = "")
  public BigDecimal getStartedAt() {
    return startedAt;
  }

  public void setStartedAt(BigDecimal startedAt) {
    this.startedAt = startedAt;
  }

  public ImageTrawlerResultDto finishedAt(BigDecimal finishedAt) {
    this.finishedAt = finishedAt;
    return this;
  }

   /**
   * Get finishedAt
   * @return finishedAt
  **/
  @Schema(required = true, description = "")
  public BigDecimal getFinishedAt() {
    return finishedAt;
  }

  public void setFinishedAt(BigDecimal finishedAt) {
    this.finishedAt = finishedAt;
  }

  public ImageTrawlerResultDto policyId(BigDecimal policyId) {
    this.policyId = policyId;
    return this;
  }

   /**
   * Get policyId
   * @return policyId
  **/
  @Schema(required = true, description = "")
  public BigDecimal getPolicyId() {
    return policyId;
  }

  public void setPolicyId(BigDecimal policyId) {
    this.policyId = policyId;
  }

  public ImageTrawlerResultDto policyStatus(Boolean policyStatus) {
    this.policyStatus = policyStatus;
    return this;
  }

   /**
   * Get policyStatus
   * @return policyStatus
  **/
  @Schema(required = true, description = "")
  public Boolean isPolicyStatus() {
    return policyStatus;
  }

  public void setPolicyStatus(Boolean policyStatus) {
    this.policyStatus = policyStatus;
  }

  public ImageTrawlerResultDto imageHash(String imageHash) {
    this.imageHash = imageHash;
    return this;
  }

   /**
   * Get imageHash
   * @return imageHash
  **/
  @Schema(required = true, description = "")
  public String getImageHash() {
    return imageHash;
  }

  public void setImageHash(String imageHash) {
    this.imageHash = imageHash;
  }

  public ImageTrawlerResultDto issues(List<ScanImageIssue> issues) {
    this.issues = issues;
    return this;
  }

  public ImageTrawlerResultDto addIssuesItem(ScanImageIssue issuesItem) {
    this.issues.add(issuesItem);
    return this;
  }

   /**
   * Get issues
   * @return issues
  **/
  @Schema(required = true, description = "")
  public List<ScanImageIssue> getIssues() {
    return issues;
  }

  public void setIssues(List<ScanImageIssue> issues) {
    this.issues = issues;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ImageTrawlerResultDto imageTrawlerResultDto = (ImageTrawlerResultDto) o;
    return Objects.equals(this.summary, imageTrawlerResultDto.summary) &&
        Objects.equals(this.criticalIssues, imageTrawlerResultDto.criticalIssues) &&
        Objects.equals(this.majorIssues, imageTrawlerResultDto.majorIssues) &&
        Objects.equals(this.mediumIssues, imageTrawlerResultDto.mediumIssues) &&
        Objects.equals(this.lowIssues, imageTrawlerResultDto.lowIssues) &&
        Objects.equals(this.negligibleIssues, imageTrawlerResultDto.negligibleIssues) &&
        Objects.equals(this.encounterError, imageTrawlerResultDto.encounterError) &&
        Objects.equals(this.startedAt, imageTrawlerResultDto.startedAt) &&
        Objects.equals(this.finishedAt, imageTrawlerResultDto.finishedAt) &&
        Objects.equals(this.policyId, imageTrawlerResultDto.policyId) &&
        Objects.equals(this.policyStatus, imageTrawlerResultDto.policyStatus) &&
        Objects.equals(this.imageHash, imageTrawlerResultDto.imageHash) &&
        Objects.equals(this.issues, imageTrawlerResultDto.issues);
  }

  @Override
  public int hashCode() {
    return Objects.hash(summary, criticalIssues, majorIssues, mediumIssues, lowIssues, negligibleIssues, encounterError, startedAt, finishedAt, policyId, policyStatus, imageHash, issues);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ImageTrawlerResultDto {\n");
    
    sb.append("    summary: ").append(toIndentedString(summary)).append("\n");
    sb.append("    criticalIssues: ").append(toIndentedString(criticalIssues)).append("\n");
    sb.append("    majorIssues: ").append(toIndentedString(majorIssues)).append("\n");
    sb.append("    mediumIssues: ").append(toIndentedString(mediumIssues)).append("\n");
    sb.append("    lowIssues: ").append(toIndentedString(lowIssues)).append("\n");
    sb.append("    negligibleIssues: ").append(toIndentedString(negligibleIssues)).append("\n");
    sb.append("    encounterError: ").append(toIndentedString(encounterError)).append("\n");
    sb.append("    startedAt: ").append(toIndentedString(startedAt)).append("\n");
    sb.append("    finishedAt: ").append(toIndentedString(finishedAt)).append("\n");
    sb.append("    policyId: ").append(toIndentedString(policyId)).append("\n");
    sb.append("    policyStatus: ").append(toIndentedString(policyStatus)).append("\n");
    sb.append("    imageHash: ").append(toIndentedString(imageHash)).append("\n");
    sb.append("    issues: ").append(toIndentedString(issues)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }

}
